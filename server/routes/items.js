const express = require("express");
const router = express.Router();
const auth = require("../auth");

const itemModel = require("../models/item");

router.get("/", auth, (req, res) => {
	itemModel
		.find({ user: req.user.username })
		.sort({ createdAt: -1 })
		.then((docs) => res.json(docs))
		.catch((err) => console.error(err));
});

router.post("/", auth, (req, res) => {
	const newItem = new itemModel({
		name: req.body.name,
		price: req.body.price,
		category: req.body.category,
		user: req.user.username,
	});

	newItem
		.save()
		.then((doc) => res.json(doc))
		.catch((err) => console.error(err));
});

router.delete("/", auth, (req, res) => {
	itemModel
		.deleteMany({ _id: { $in: req.body } })
		.then((doc) => res.json(doc))
		.catch((err) => console.error(err));
});

router.put("/", auth, (req, res) => {
	itemModel
		.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
		.then((doc) => res.json(doc))
		.catch((err) => console.error(err));
});

router.put("/category", auth, (req, res) => {
	itemModel
		.updateMany(
			{ category: req.body.currentCategory, user: req.user.username },
			{ $set: { category: req.body.newCategory } }
		)
		.then((doc) => res.json(doc))
		.catch((err) => console.error(err));
});

module.exports = router;
