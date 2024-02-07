import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import { makeStyles } from "@mui/styles";
import { lighten } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1)
	},
	highlight: {
		color: theme.palette.secondary.main,
		backgroundColor: lighten(theme.palette.secondary.light, 0.85)
	},
	title: {
		flex: "1 1 100%"
	}
}));

export default function TableToolbar({ selected, handleDelete }) {
	const classes = useToolbarStyles();
	const { findItem } = useContext(BudgetContext);
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: selected.length > 0
			})}
			variant="dense"
		>
			<Typography className={classes.title} color="inherit" variant="subtitle1">
				{selected.length} selected
			</Typography>

			{selected.length === 1 && (
				<Tooltip title="Edit">
					<IconButton
						aria-label="edit"
						onClick={event => findItem(event, selected[0])}
					>
						<EditIcon />
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title="Delete">
				<IconButton
					aria-label="delete"
					onClick={event => handleDelete(event, selected)}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</Toolbar>
	);
}

TableToolbar.propTypes = {
	selected: PropTypes.array.isRequired
};
