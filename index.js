const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const itemsRouter = require("./routes/items");
const usersRouter = require("./routes/users");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
	.connect(`${process.env.mongoURI}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log("Database connected successfully");
	})
	.catch(err => {
		console.error(err);
	});

app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App started on port ${port}`));
