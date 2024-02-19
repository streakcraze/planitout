const mongoose = require("mongoose");
const passwordResetSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	uniqueString: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	expiresAt: {
		type: Date,
	},
});

module.exports = mongoose.model("password-reset", passwordResetSchema);
