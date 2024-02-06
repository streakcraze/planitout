const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../auth");
require("dotenv").config();

const userModel = require("../models/user");

router.get("/", auth, (req, res) => {
	userModel
		.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user));
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
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser
					.save()
					.then((user) => {
						jwt.sign(
							{ id: user._id },
							process.env.jwtSecret,
							{ expiresIn: 3600 },
							(err, token) => {
								if (err) throw err;
								res.json({
									user: {
										token,
										id: user._id,
										username: user.username,
										email: user.email,
									},
								});
							}
						);
					})
					.catch((err) => {
						res.status(500).json({ msg: "internal server error" });
						console.log(err);
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

			bcrypt.compare(password, user.password).then((isMatch) => {
				if (!isMatch) return res.status(400).json({ msg: "wrong password" });

				jwt.sign(
					{ id: user._id },
					process.env.jwtSecret,
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) throw err;
						res.json({
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
			res.status(500).json({ msg: "internal server error" });
			console.log(err);
		});
});

module.exports = router;
