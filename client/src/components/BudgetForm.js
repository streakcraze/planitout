import React, { useState, useContext, useEffect, createRef } from "react";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import { useMediaQuery } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Form({ category }) {
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const { addItems, editItem, updateItem } = useContext(BudgetContext);

	let nameRef = createRef();
	let priceRef = createRef();

	useEffect(() => {
		if (editItem) {
			nameRef.current.value = editItem.name;
			priceRef.current.value = editItem.price;
		}
	}, [editItem]);

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [errors, setErrors] = useState({});

	const sxStyles = {
		inputField: {
			margin: "20px",
			width: smallScreen ? 250 : 180,
			display: smallScreen ? "block" : "",
		},
		submitButton: {
			display: "block",
			margin: "0 auto",
		},
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let bundle = {};
		if (!editItem) {
			if (name !== "" && price !== "") {
				bundle = {
					name,
					price,
					category,
				};
				addItems(bundle);
				setName("");
				setPrice("");
			}
		} else {
			bundle = {
				name: nameRef.current.value,
				price: parseInt(priceRef.current.value, 10),
			};
			updateItem({ _id: editItem._id, ...bundle });
		}
		e.target.reset();
	};

	const handleChange = (e) => {
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
				variant="standard"
				helperText={errors.name ? errors.name : ""}
				onChange={handleChange}
				sx={{ ...sxStyles.inputField }}
				InputLabelProps={{ shrink: true }}
				inputRef={nameRef}
			/>
			<TextField
				label="PRICE"
				name="price"
				error={errors.price ? true : false}
				fullWidth
				variant="standard"
				helperText={errors.price}
				onChange={handleChange}
				sx={{ ...sxStyles.inputField }}
				InputLabelProps={{ shrink: true }}
				inputRef={priceRef}
			/>
			<Button
				type="submit"
				variant="contained"
				color="secondary"
				sx={{ ...sxStyles.submitButton }}
			>
				{editItem ? "edit" : "submit"}
			</Button>
		</form>
	);
}
