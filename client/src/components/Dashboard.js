import React, { useState, useContext, useEffect } from "react";
import ReactLoading from "react-loading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BudgetContext } from "../context/BudgetContext";
import BudgetForm from "./BudgetForm";
import BudgetTable from "./BudgetTable";
import BudgetTotal from "./BudgetTotal";

//MUI
import { useMediaQuery } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Dashboard() {
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const { category } = useParams();
	const navigate = useNavigate();

	let {
		items,
		categories,
		getItems,
		itemsLoading,
		deleteItems,
		updateCategory,
	} = useContext(BudgetContext);
	items = items.filter((item) => item.category === category);

	useEffect(() => {
		getItems();
	}, []);

	const [open, setOpen] = useState(false);
	const [update, setUpdate] = useState("");
	const [error, setError] = useState(null);

	const sxStyles = {
		header: {
			display: "flex",
			justifyContent: "space-between",
			margin: 5,
		},
		category: {
			display: "flex",
			textTransform: "capitalize",
			margin: smallScreen ? "15px auto 0" : "15px 15px 0",
		},
		backButton: {
			margin: smallScreen ? "20px auto 0" : "20px 20px 0",
			textDecoration: "none",
			color: "black",
		},
		loadingUI: {
			position: "absolute",
			left: "50%",
			top: smallScreen ? "75%" : "60%",
			transform: "translate(-50%, -50%)",
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
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (e) => {
		setUpdate(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (update.trim() === "") setError("field must not be empty");
		else if (categories.indexOf(update) !== -1)
			setError("category already exists");
		else {
			updateCategory(category, update);
			navigate(`/items/${update}`);
			setError(null);
			setOpen(false);
			setUpdate("");
		}
	};

	const handleDelete = () => {
		if (window.confirm("Delete Category?")) {
			deleteItems(items.map((item) => item._id));
			navigate("/");
		}
	};

	return (
		<>
			{itemsLoading && (
				<div style={{ ...sxStyles.loadingUI }}>
					<ReactLoading type={"bars"} color={"#3792cb"} width={100} />
				</div>
			)}
			<div style={{ ...sxStyles.header }}>
				<div style={{ ...sxStyles.category }}>
					<Typography variant="h4" color="secondary">
						{category}
					</Typography>
					<IconButton onClick={handleOpen} size="small">
						<EditIcon color="secondary" />
					</IconButton>
					<IconButton onClick={handleDelete} size="small">
						<DeleteIcon color="secondary" />
					</IconButton>
				</div>
				<Link to="/" style={{ ...sxStyles.backButton }}>
					&#8592;back
				</Link>
			</div>
			<BudgetForm category={category} />
			<BudgetTable category={category} />
			<BudgetTotal category={category} />

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
		</>
	);
}
