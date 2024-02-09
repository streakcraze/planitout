import React, { useState, useContext, useEffect } from "react";
import ReactLoading from "react-loading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BudgetContext } from "../context/BudgetContext";
import BudgetForm from "./BudgetForm";
import BudgetTable from "./BudgetTable";
import BudgetTotal from "./BudgetTotal";

//MUI
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
	header: {
		display: "flex",
		justifyContent: "space-between",
		margin: 5,
		"& .back-button": {
			margin: "20px 20px 0",
			textDecoration: "none",
			color: "black",
			[theme.breakpoints.down("xs")]: {
				margin: "20px 10px 0",
			},
		},
	},
	category: {
		display: "flex",
		textTransform: "capitalize",
		margin: "15px 15px 0",
		"& .category-button": {
			paddingBottom: 10,
		},
	},
	loadingUI: {
		position: "absolute",
		left: "50%",
		top: "60%",
		transform: "translate(-50%, -50%)",
		[theme.breakpoints.down("xs")]: {
			top: "75%",
		},
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	inputField: {
		marginBottom: 30,
	},
	submitButton: {
		display: "block",
		margin: "0 auto",
	},
}));

export default function Dashboard() {
	const { category } = useParams();
	const classes = useStyles();
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
	const [open, setOpen] = useState(false);
	const [update, setUpdate] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		getItems();
	}, []);

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
				<ReactLoading
					type={"bars"}
					color={"#3792cb"}
					width={100}
					className={classes.loadingUI}
				/>
			)}
			<div className={classes.header}>
				<div className={classes.category}>
					<Typography variant="h4" gutterBottom color="secondary">
						{category}
					</Typography>
					<IconButton onClick={handleOpen} size="small">
						<EditIcon color="secondary" className="category-button" />
					</IconButton>
					<IconButton onClick={handleDelete} size="small">
						<DeleteIcon color="secondary" className="category-button" />
					</IconButton>
				</div>
				<Link to="/" className="back-button">
					&#8592;back
				</Link>
			</div>
			<BudgetForm category={category} />
			<BudgetTable category={category} />
			<BudgetTotal category={category} />

			<Modal
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<form noValidate autoComplete="off" onSubmit={handleSubmit}>
							<TextField
								label="Name"
								name="category"
								fullWidth
								error={error ? true : false}
								helperText={error}
								onChange={handleChange}
								className={classes.inputField}
							/>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								className={classes.submitButton}
							>
								edit
							</Button>
						</form>
					</div>
				</Fade>
			</Modal>
		</>
	);
}
