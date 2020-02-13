import React, { useContext, useState, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {
		width: 350,
		padding: 20,
		position: "relative",
		[theme.breakpoints.down("xs")]: {
			width: 250
		}
	},
	container: {
		display: "grid",
		gridTemplateColumns: "auto auto",
		gridGap: 20,
		[theme.breakpoints.down("xs")]: {
			gridTemplateColumns: "auto"
		}
	},
	category: {
		border: "1px dashed black",
		borderRadius: 20,
		padding: 20,
		textAlign: "center",
		fontSize: 18,
		outline: "none",
		"&:hover": {
			cursor: "pointer",
			backgroundColor: "#a9a9a9",
			transform: "scale(1.05)"
		}
	},
	addIcon: {
		float: "right",
		border: "1px dashed",
		borderRadius: 20,
		margin: "20px 40px 20px 0"
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	},
	inputField: {
		marginBottom: 30
	},
	submitButton: {
		display: "block",
		margin: "0 auto"
	},
	loadingUI: {
		position: "absolute",
		left: "50%",
		top: "80%",
		transform: "translate(-50%, -50%)"
	}
}));

export default function Home() {
	const classes = useStyles();
	const history = useHistory();
	const { categories, addCategory, itemsLoading, getItems } = useContext(
		BudgetContext
	);
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState("");
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

	const handleChange = e => {
		setCategory(e.target.value);
	};

	const handleSubmit = e => {
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
		<div className={classes.root}>
			<Typography
				variant="h4"
				gutterBottom
				color="secondary"
				style={{ textAlign: "center" }}
			>
				CATEGORIES
			</Typography>
			{itemsLoading ? (
				<ReactLoading
					type={"bars"}
					color={"#3792cb"}
					width={100}
					className={classes.loadingUI}
				/>
			) : (
				categories && (
					<div className={classes.container}>
						{categories.map((category, i) => (
							<button
								key={i}
								className={classes.category}
								onClick={() => history.push(`/items/${category}`)}
							>
								{category}
							</button>
						))}
					</div>
				)
			)}
			<IconButton className={classes.addIcon} onClick={handleOpen}>
				<AddIcon fontSize="large" />
			</IconButton>
			<Modal
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
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
								submit
							</Button>
						</form>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
