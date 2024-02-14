const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const auth = require("../auth");
const userModel = require("../models/user");
const userVerificationModel = require("../models/userVerification");

router.get("/", auth, (req, res) => {
	userModel
		.findById(req.user.id)
		.select("-password")
		.then((user) => res.status(200).json(user))
		.catch((err) =>
			res.status(500).json({ msg: "error searching user model", err })
		);
});

router.post("/register", (req, res) => {
	const { username, email, password } = req.body;

	userModel.findOne({ $or: [{ username }, { email }] }).then((user) => {
		if (user) {
			if (user.username === username) {
				return res.status(400).json({ msg: "username already exists!" });
			} else {
				return res.status(400).json({ msg: "email already exists!" });
			}
		}

		const newUser = new userModel({
			username,
			email,
			password,
		});

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return res.status(500).json({ msg: "error generating salt", err });
			}

			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) {
					return res.status(500).json({ msg: "error hashing password", err });
				}

				newUser.password = hash;
				newUser
					.save()
					.then((user) => {
						sendVerificationEmail(user, res);
						// jwt.sign(
						// 	{ id: user._id },
						// 	process.env.jwtSecret,
						// 	{ expiresIn: 3600 },
						// 	(err, token) => {
						// 		if (err) {
						// 			return res
						// 				.status(500)
						// 				.json({ msg: "error generating token", err });
						// 		}
						// 		res.status(200).json({
						// 			user: {
						// 				token,
						// 				id: user._id,
						// 				username: user.username,
						// 				email: user.email,
						// 			},
						// 		});
						// 	}
						// );
					})
					.catch((err) => {
						res.status(500).json({ msg: "error saving user model", err });
					});
			});
		});
	});
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	userModel
		.findOne({ username })
		.then((user) => {
			if (!user)
				return res.status(400).json({ msg: "username does not exist" });

			if (!user.verified)
				return res.status(400).json({ msg: "email has not been verified" });

			bcrypt.compare(password, user.password).then((isMatch) => {
				if (!isMatch) return res.status(400).json({ msg: "wrong password" });

				jwt.sign(
					{ id: user._id },
					process.env.jwtSecret,
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) {
							return res
								.status(500)
								.json({ msg: "error generating token", err });
						}
						res.status(200).json({
							user: {
								token,
								id: user._id,
								username: user.username,
								email: user.email,
							},
						});
					}
				);
			});
		})
		.catch((err) => {
			res.status(500).json({ msg: "error searching user model", err });
		});
});

router.get("/verify/:userId/:uniqueString", (req, res) => {
	let { userId, uniqueString } = req.params;

	userVerificationModel
		.find({ userId })
		.then((result) => {
			if (result.length > 0) {
				const { expiresAt } = result[0];
				const hashedUniqueString = result[0].uniqueString;

				if (expiresAt < Date.now()) {
					userVerificationModel
						.deleteOne({ userId })
						.then(() => {
							userModel
								.deleteOne({ _id: userId })
								.then(() =>
									res
										.status(400)
										.json({ msg: "link has expired. sign up again" })
								)
								.catch((err) =>
									res.status(500).json({
										msg: "error clearing user record with expired verification record",
										err,
									})
								);
						})
						.catch((err) =>
							res.status(500).json({
								msg: "error while clearing expired user verification record",
								err,
							})
						);
				} else {
					bcrypt
						.compare(uniqueString, hashedUniqueString)
						.then((result) => {
							if (result) {
								userModel
									.updateOne({ _id: userId }, { verified: true })
									.then(() => {
										userVerificationModel
											.deleteOne({ userId })
											.then(() =>
												res.status(200).json({
													msg: "successfull verification. you can now login",
												})
											)
											.catch((err) =>
												res.status(500).json({
													msg: "error removing used user verification record",
													err,
												})
											);
									})
									.catch((err) =>
										res.status(500).json({
											msg: "error updating user verified field to true",
											err,
										})
									);
							} else {
								res.status(400).json({
									msg: "invalid verification details. click the link in the inbox again.",
								});
							}
						})
						.catch((err) =>
							res.status(500).json({
								msg: "error comparing unique strings from verification link and database",
								err,
							})
						);
				}
			} else {
				return res.status(500).json({
					msg: "account record doesn't exist or has been verified already",
				});
			}
		})
		.catch((err) =>
			res
				.status(500)
				.json({ msg: "error searching record for user verification", err })
		);
});

// nodemailer stuff
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASS,
	},
});

// testing success
transporter.verify((error, success) => {
	if (error) console.log(error);
	else {
		console.log("ready for messages");
		console.log(success);
	}
});

// send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
	// url to be used in the email
	const currentURL = "http://localhost:4000";

	const uniqueString = uuidv4() + _id;

	const mailOptions = {
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: "Verify Your Email",
		html: `<p>Verify your email to complete the signup and login to your account.</p>
				<p>This link <b>expires in 6 hours</b></p>
				<p>Press <a href=${
					currentURL + "/api/users/verify" + _id + "/" + uniqueString
				}>here</a> to continue.</p>`,
	};

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return res.status(500).json({ msg: "error generating salt", err });
		}

		bcrypt.hash(uniqueString, salt, (err, hashedUniqueString) => {
			if (err) {
				return res.status(500).json({ msg: "error hashing uniqueString", err });
			}

			const newUserVerification = new userVerificationModel({
				userId: _id,
				uniqueString: hashedUniqueString,
				expiresAt: Date.now() + 21600000,
			});

			newUserVerification
				.save()
				.then(() => {
					transporter
						.sendMail(mailOptions)
						.then(() =>
							res
								.status(200)
								.json({ msg: "user verification email sent successfully" })
						)
						.catch((err) => {
							res
								.status(500)
								.json({ msg: "error sending user verification email", err });
						});
				})
				.catch((err) => {
					res
						.status(500)
						.json({ msg: "error saving user verification model", err });
				});
		});
	});
};

module.exports = router;
