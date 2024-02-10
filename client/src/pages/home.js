import React, { useContext, useState, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import ReactLoading from "react-loading";
import Category from "../components/Category";

//MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const { categories, addCategory, itemsLoading, getItems } =
		useContext(BudgetContext);

	useEffect(() => {
		getItems();
	}, []);

	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState("");
	const [error, setError] = useState(null);

	const sxStyles = {
		root: {
			padding: 20,
			position: "relative",
			width: smallScreen ? 250 : 350,
		},
		container: {
			display: "grid",
			gridGap: 20,
			zIndex: 1,
			gridTemplateColumns: smallScreen ? "auto" : "auto auto",
		},
		category: {
			border: "1px dashed black",
			borderRadius: 20,
			padding: 20,
			textAlign: "center",
			fontSize: 18,
			outline: "none",
		},
		addIcon: {
			float: "right",
			border: "1px dashed",
			borderRadius: 20,
			margin: "20px 40px 20px 0",
		},
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		paper: {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			backgroundColor: (theme) => theme.palette.background.paper,
			border: "2px solid #000",
			boxShadow: (theme) => theme.shadows[5],
			padding: (theme) => theme.spacing(2, 4, 3),
		},
		inputField: {
			marginBottom: "30px",
		},
		submitButton: {
			display: "block",
			margin: "0 auto",
		},
		loadingUI: {
			position: "absolute",
			left: "50%",
			top: "80%",
			transform: "translate(-50%, -50%)",
		},
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (e) => {
		setCategory(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (category.trim() === "") setError("field must not be empty");
		else if (categories.indexOf(category) !== -1)
			setError("category already exists");
		else {
			addCategory(category);
			setError(null);
			setOpen(false);
			setCategory("");
		}
	};

	return (
		<div style={{ ...sxStyles.root }}>
			<Typography
				variant="h4"
				gutterBottom
				color="secondary"
				sx={{ textAlign: "center" }}
			>
				CATEGORIES
			</Typography>
			{itemsLoading ? (
				<div style={{ ...sxStyles.loadingUI }}>
					<ReactLoading type={"bars"} color={"#3792cb"} width={100} />
				</div>
			) : (
				categories && (
					<div
						style={{
							...sxStyles.container,
						}}
					>
						{categories.map((category, index) => (
							<Category
								category={category}
								index={index}
								sxStyles={sxStyles.category}
							/>
						))}
					</div>
				)
			)}
			<IconButton sx={{ ...sxStyles.addIcon }} onClick={handleOpen}>
				<AddIcon fontSize="large" />
			</IconButton>
			<Modal
				sx={{ ...sxStyles.modal }}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={{ ...sxStyles.paper }}>
						<form noValidate autoComplete="off" onSubmit={handleSubmit}>
							<TextField
								label="Name"
								name="category"
								fullWidth
								variant="standard"
								error={error ? true : false}
								helperText={error}
								onChange={handleChange}
								sx={{ ...sxStyles.inputField }}
							/>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								sx={{ ...sxStyles.submitButton }}
							>
								submit
							</Button>
						</form>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}
