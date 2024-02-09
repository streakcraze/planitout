import React, { useContext, useState, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

//MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const navigate = useNavigate();
	const { categories, addCategory, itemsLoading, getItems } =
		useContext(BudgetContext);
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState("");
	const [error, setError] = useState(null);
	const [hoverStyles, setHoverStyles] = useState({});

	useEffect(() => {
		getItems();
	}, []);

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
			backgroundColor: (theme) => theme.palette.background.paper,
			border: "2px solid #000",
			boxShadow: (theme) => theme.shadows[5],
			padding: (theme) => theme.spacing(2, 4, 3),
		},
		inputField: {
			marginBottom: 30,
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
				<ReactLoading
					type={"bars"}
					color={"#3792cb"}
					width={100}
					style={{ ...sxStyles.loadingUI }}
				/>
			) : (
				categories && (
					<div
						style={{
							...sxStyles.container,
						}}
					>
						{categories.map((category, i) => (
							<button
								key={i}
								style={{
									...sxStyles.category,
									...hoverStyles,
								}}
								onMouseEnter={(e) => {
									setHoverStyles({
										cursor: "pointer",
										backgroundColor: "#a9a9a9",
										transform: "scale(1.05)",
									});
								}}
								onMouseLeave={(e) => {
									setHoverStyles({});
								}}
								onClick={() => navigate(`/items/${category}`)}
							>
								{category}
							</button>
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
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div style={{ ...sxStyles.paper }}>
						<form noValidate autoComplete="off" onSubmit={handleSubmit}>
							<TextField
								label="Name"
								name="category"
								fullWidth
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
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
