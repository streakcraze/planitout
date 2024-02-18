const jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("./models/user");

function auth(req, res, next) {
	const token = req.header("x-auth-token");

	if (!token) return res.status(401).json({ msg: "No token" });

	try {
		const decodedToken = jwt.verify(token, process.env.jwtSecret);
		req.user = decodedToken;
		userModel
			.findById(req.user.id)
			.then((user) => {
				req.user.username = user.username;
				next();
			})
			.catch((err) => res.status(401).json({ msg: "invalid token", err }));
	} catch (e) {
		res.status(401).json({ msg: "invalid token", e });
	}
}

module.exports = auth;
