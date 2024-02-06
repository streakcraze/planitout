import React, { useState, useContext, useEffect, createRef } from "react";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	inputField: {
		margin: 20,
		width: 180,
		[theme.breakpoints.down("xs")]: {
			display: "block",
			width: 250
		}
	},
	submitButton: {
		display: "block",
		margin: "0 auto"
	}
}));

export default function Form({ category }) {
	const classes = useStyles();
	const { addItems, editItem, updateItem } = useContext(BudgetContext);
	let nameRef = createRef();
	let priceRef = createRef();

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (editItem) {
			nameRef.current.value = editItem.name;
			priceRef.current.value = editItem.price;
		}
	}, [editItem]);

	const handleSubmit = e => {
		e.preventDefault();
		let bundle = {};
		if (!editItem) {
			if (name !== "" && price !== "") {
				bundle = {
					name,
					price,
					category
				};
				addItems(bundle);
				setName("");
				setPrice("");
			}
		} else {
			bundle = {
				name: nameRef.current.value,
				price: parseInt(priceRef.current.value, 10)
			};
			updateItem({ _id: editItem._id, ...bundle });
		}
		e.target.reset();
	};

	const handleChange = e => {
		const { name, value } = e.target;
		switch (name) {
			case "name":
				if (value.match(/[A-Za-z]+/g)) {
					setName(value);
					delete errors.name;
				} else {
					setErrors({ ...errors, name: "insert valid name" });
				}
				break;
			case "price":
				if (value.match(/^[0-9]*$/gm)) {
					setPrice(parseInt(value, 10));
					delete errors.price;
				} else {
					setErrors({ ...errors, price: "insert valid price" });
				}
				break;
			default:
				return null;
		}
	};

	return (
		<form onSubmit={handleSubmit} noValidate autoComplete="off">
			<TextField
				label="NAME"
				name="name"
				error={errors.name ? true : false}
				fullWidth
				helperText={errors.name ? errors.name : ""}
				onChange={handleChange}
				className={classes.inputField}
				InputLabelProps={{ shrink: true }}
				inputRef={nameRef}
			/>
			<TextField
				label="PRICE"
				name="price"
				error={errors.price ? true : false}
				fullWidth
				helperText={errors.price}
				onChange={handleChange}
				className={classes.inputField}
				InputLabelProps={{ shrink: true }}
				inputRef={priceRef}
			/>
			<Button
				type="submit"
				variant="contained"
				color="secondary"
				className={classes.submitButton}
			>
				{editItem ? "edit" : "submit"}
			</Button>
		</form>
	);
}
