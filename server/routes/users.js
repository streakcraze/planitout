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
const passwordResetModel = require("../models/passwordReset");

router.get("/", auth, (req, res) => {
	userModel
		.findById(req.user.id)
		.select("-password")
		.then((user) => {
			res.status(200).json(user);
		})
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
		if (verificationRecord) {
			const { expiresAt, uniqueString: hashedUniqueString } =
				verificationRecord;

			if (expiresAt < Date.now()) {
				try {
					await userVerificationModel.deleteOne({ userId });
					await userModel.deleteOne({ _id: userId });
					const topic = "invalid link";
					const text = "link has expired, sign up again";
					res.render(responseTemplate, { topic, text });
				} catch (err) {
					console.log(err);
					const topic = "internal server error";
					const text =
						"ran into problems clearing expired user, please contact support";
					res.render(responseTemplate, { topic, text });
				}
			} else {
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
							console.log(err);
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
					console.log(err);
					const topic = "internal server error";
					const text =
						"ran into problems verifying link, please contact support";
					res.render(responseTemplate, { topic, text });
				}
			}
		} else {
			const topic = "invalid link";
			const text = "link has already been used, proceed to login";
			res.render(responseTemplate, { topic, text });
		}
	} catch (err) {
		console.log(err);
		const topic = "internal server error";
		const text =
			"ran into problems searching link record, please contact support";
		res.render(responseTemplate, { topic, text });
	}
});

router.post("/passwordResetEmail", (req, res) => {
	const { email } = req.body;
	serverURL = req.protocol + "://" + req.get("host");

	userModel
		.findOne({ email })
		.then((user) => {
			if (user) {
				passwordResetModel
					.findOne({ userId: user._id })
					.then((passwordLink) => {
						if (passwordLink) {
							res.status(404).json({
								msg: "password reset link has already been sent, check your email",
							});
						} else {
							sendPasswordResetEmail(user, serverURL, res);
						}
					});
			} else {
				res.status(404).json({ msg: "user does not exist, sign up" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				msg: "server error searching user records, contact support",
			});
		});
});

router.get("/passwordResetLink/:userId/:uniqueString", (req, res) => {
	let { userId, uniqueString } = req.params;
	serverURL = req.protocol + "://" + req.get("host");
	const responseTemplate = "passwordResetMessage";
	const formTemplate = "passwordReset";

	passwordResetModel
		.findOne({ userId })
		.then((linkRecord) => {
			if (linkRecord) {
				const { expiresAt, uniqueString: hashedUniqueString } = linkRecord;

				if (expiresAt < Date.now()) {
					passwordResetModel
						.deleteOne({ userId })
						.then(() => {
							const topic = "invalid link";
							const text = "link has expired, request for another one";
							res.render(responseTemplate, { topic, text });
						})
						.catch((err) => {
							console.log(err);
							const topic = "internal server error";
							const text =
								"ran into problems clearing expired link, please contact support";
							res.render(responseTemplate, { topic, text });
						});
				} else {
					bcrypt
						.compare(uniqueString, hashedUniqueString)
						.then((result) => {
							if (result) {
								res.render(formTemplate, { serverURL, userId });
							} else {
								const topic = "invalid link";
								const text = "wrong link, check your inbox again";
								res.render(responseTemplate, { topic, text });
							}
						})
						.catch((err) => {
							console.log(err);
							const topic = "internal server error";
							const text =
								"ran into problems verifying link, please contact support";
							res.render(responseTemplate, { topic, text });
						});
				}
			} else {
				const topic = "invalid link";
				const text = "link has already been used, request for another one";
				res.render(responseTemplate, { topic, text });
			}
		})
		.catch((err) => {
			console.log(err);
			const topic = "internal server error";
			const text =
				"ran into problems searching link record, please contact support";
			res.render(responseTemplate, { topic, text });
		});
});

router.post("/passwordResetDetails/:userId", (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const { userId } = req.params;

	userModel
		.findOne({ _id: userId })
		.then((user) => {
			if (user) {
				bcrypt
					.compare(oldPassword, user.password)
					.then((result) => {
						if (result) {
							passwordResetModel
								.deleteOne({ userId })
								.then(() => {
									bcrypt.genSalt(10, (err, salt) => {
										if (err) {
											return res
												.status(500)
												.json({ msg: "error generating salt", err });
										}

										bcrypt.hash(newPassword, salt, (err, hashedNewPassword) => {
											if (err) {
												return res
													.status(500)
													.json({ msg: "error hashing password", err });
											}

											userModel
												.updateOne(
													{ _id: userId },
													{ password: hashedNewPassword }
												)
												.then(() => {
													res.status(200).json({
														msg: "password has been changed successfully",
													});
												})
												.catch((err) => {
													console.log(err);
													res.status(500).json({
														msg: "encountered problems updating password, please contact support",
													});
												});
										});
									});
								})
								.catch((err) => {
									console.log(err);
									res.status(500).json({
										msg: "encountered problems clearing used link, please contact support",
									});
								});
						} else {
							res
								.status(401)
								.json({ msg: "wrong old password, please input again" });
						}
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({
							msg: "encountered problems when comparing passwords, please contact support",
						});
					});
			} else {
				res.status(401).json({
					msg: "sorry, the user record does not exist, please sign up",
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				msg: "encountered problems looking into user records, please contact support",
			});
		});
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
			console.log(err);
			return res.status(500).json({
				msg: "server error in a salting process, contact support",
			});
		}

		bcrypt.hash(uniqueString, salt, (err, hashedUniqueString) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					msg: "server error in a hashing process, contact support",
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
							console.log(err);
							res.status(500).json({
								msg: "internal server error sending verification email",
							});
						});
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({
						msg: "internal server error saving verification details",
					});
				});
		});
	});
};

// send password reset email
const sendPasswordResetEmail = ({ _id, email }, serverURL, res) => {
	const uniqueString = uuidv4() + _id;

	const mailOptions = {
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: "Reset Your Password",
		html: `<head><style>
					div {
						margin: 20px auto;
					}
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
				<p>Use the link below to reset your password.</p>
				<p>It <b>expires in 6 hours</b>.</p>
				<div><a href=${
					serverURL + "/api/users/resetPassword/" + _id + "/" + uniqueString
				} target='_blank'>Reset Password</a></div>
				</body>`,
	};

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return res.status(500).json({
				msg: "server error in a salting process, contact support",
				err,
			});
		}

		bcrypt.hash(uniqueString, salt, (err, hashedUniqueString) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					msg: "server error in a hashing process, contact support",
				});
			}

			const newPasswordReset = new passwordResetModel({
				userId: _id,
				uniqueString: hashedUniqueString,
				expiresAt: Date.now() + 21600000,
			});

			newPasswordReset
				.save()
				.then(() => {
					transporter
						.sendMail(mailOptions)
						.then(() =>
							res
								.status(200)
								.json({ msg: "password reset email sent successfully" })
						)
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								msg: "server error sending password reset email, contact support",
							});
						});
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({
						msg: "server error saving password reset record, contact support",
					});
				});
		});
	});
};

module.exports = router;
