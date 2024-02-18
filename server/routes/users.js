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
	serverURL = req.protocol + "://" + req.get("host");

	userModel.findOne({ $or: [{ username }, { email }] }).then((user) => {
		if (user) {
			if (user.username === username) {
				return res.status(400).json({ msg: "username already exists!" });
			} else {
				return res.status(400).json({ msg: "email already exists!" });
			}
		}

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return res.status(500).json({ msg: "error generating salt", err });
			}

			bcrypt.hash(password, salt, (err, hashedPassword) => {
				if (err) {
					return res.status(500).json({ msg: "error hashing password", err });
				}

				const newUser = new userModel({
					username,
					email,
					password: hashedPassword,
				});

				newUser
					.save()
					.then((user) => {
						sendVerificationEmail(user, serverURL, res);
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

router.get("/verify/:userId/:uniqueString", async (req, res) => {
	let { userId, uniqueString } = req.params;
	const responseTemplate = "emailVerification";

	try {
		const verificationRecord = await userVerificationModel.findOne({ userId });
		const { expiresAt, uniqueString: hashedUniqueString } = verificationRecord;

		if (expiresAt < Date.now()) {
			try {
				await userVerificationModel.deleteOne({ userId });
				await userModel.deleteOne({ _id: userId });
				const topic = "invalid link";
				const text = "link has expired, sign up again";
				return res.render(responseTemplate, { topic, text });
			} catch (err) {
				const topic = "internal server error";
				const text =
					"ran into problems clearing expired user, please contact support";
				return res.render(responseTemplate, { topic, text });
			}
		}

		try {
			const result = await bcrypt.compare(uniqueString, hashedUniqueString);
			if (result) {
				try {
					await userModel.updateOne({ _id: userId }, { verified: true });
					await userVerificationModel.deleteOne({ userId });
					const topic = "successful verification";
					const text = "email has been verified, you can now login";
					res.render(responseTemplate, { topic, text });
				} catch (err) {
					const topic = "internal server error";
					const text =
						"ran into problems verifying user, please contact support";
					res.render(responseTemplate, { topic, text });
				}
			} else {
				const topic = "invalid link";
				const text = "wrong link, check your inbox again";
				res.render(responseTemplate, { topic, text });
			}
		} catch (err) {
			const topic = "internal server error";
			const text = "ran into problems verifying link, please contact support";
			res.render(responseTemplate, { topic, text });
		}
	} catch (err) {
		const topic = "invalid link";
		const text = "link has already been used, proceed to login";
		res.render(responseTemplate, { topic, text });
	}
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
	if (error) {
		console.log("error verifying transporter");
		console.log(error);
	} else {
		console.log("ready for messages");
		console.log(success);
	}
});

// send verification email
const sendVerificationEmail = ({ _id, email }, serverURL, res) => {
	const uniqueString = uuidv4() + _id;

	const mailOptions = {
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: "Verify Your Email",
		html: `<head><style>
					a {
						background-color: #f44336;
						color: white;
						padding: 10px 15px;
						text-align: center;
						text-decoration: none;
					}
					
					a:hover {
						background-color: red;
					}
				</style></head>
				<body>
				<p>Verify your email to complete the signup.</p>
				<p>This link <b>expires in 6 hours</b>.</p>
				<p>Press <a href=${
					serverURL + "/api/users/verify/" + _id + "/" + uniqueString
				} target='_blank'>here</a> to continue.</p>
				</body>`,
	};

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return res.status(500).json({
				msg: "error generating hashing salt for user verification",
				err,
			});
		}

		bcrypt.hash(uniqueString, salt, (err, hashedUniqueString) => {
			if (err) {
				return res.status(500).json({
					msg: "error hashing unique string for user verification",
					err,
				});
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
								.json({ msg: "verification email sent successfully" })
						)
						.catch((err) => {
							res.status(500).json({
								msg: "internal server error sending verification email",
								err,
							});
						});
				})
				.catch((err) => {
					res.status(500).json({
						msg: "internal server error saving verification details",
						err,
					});
				});
		});
	});
};

module.exports = router;
