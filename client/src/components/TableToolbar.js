import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import { lighten } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TableToolbar({ selected, handleDelete }) {
	const { findItem } = useContext(BudgetContext);

	const sxStyles = {
		root: {
			paddingLeft: (theme) => theme.spacing(2),
			paddingRight: (theme) => theme.spacing(1),
		},
		highlight: {
			color: (theme) => theme.palette.secondary.main,
			backgroundColor: (theme) => lighten(theme.palette.secondary.light, 0.85),
		},
		title: {
			flex: "1 1 100%",
		},
	};

	return (
		<Toolbar
			className={clsx(sxStyles.root, {
				[sxStyles.highlight]: selected.length > 0,
			})}
			variant="dense"
		>
			<Typography
				sx={{ ...sxStyles.title }}
				color="inherit"
				variant="subtitle1"
			>
				{selected.length} selected
			</Typography>

			{selected.length === 1 && (
				<Tooltip title="Edit">
					<IconButton
						aria-label="edit"
						onClick={(event) => findItem(event, selected[0])}
					>
						<EditIcon />
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title="Delete">
				<IconButton
					aria-label="delete"
					onClick={(event) => handleDelete(event, selected)}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		</Toolbar>
	);
}

TableToolbar.propTypes = {
	selected: PropTypes.array.isRequired,
};
