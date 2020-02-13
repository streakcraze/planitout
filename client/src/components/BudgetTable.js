import React, { useState, useContext, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import TableToolbar from "./TableToolbar";
import clsx from "clsx";

//MUI
import { lighten, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles(theme => ({
	paper: {
		maxWidth: 400,
		margin: "20px auto",
		[theme.breakpoints.down("xs")]: {
			width: 280,
			marginLeft: 15,
			marginRight: 15
		}
	},
	highlight: {
		color: theme.palette.secondary.main,
		backgroundColor: lighten(theme.palette.secondary.light, 0.85)
	},
	pagination: {
		"& .MuiTablePagination-input": {
			marginLeft: 0
		},
		"& .MuiButtonBase-root": {
			paddingLeft: 0
		}
	}
}));

export default function BudgetTable({ category }) {
	const classes = useStyles();
	let { items, deleteItems, editItem } = useContext(BudgetContext);
	items = items.filter(item => item.category === category);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		if (editItem) {
			setSelected([]);
		}
	}, [editItem]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

	const handleClick = (event, id) => {
		if (selected.indexOf(id) === -1) {
			setSelected([...selected, id]);
		} else {
			setSelected([...selected].filter(item => item !== id));
		}
	};

	const handleDelete = (event, items) => {
		deleteItems(items);
		setSelected([]);
	};

	return (
		<Paper elevation={3} className={classes.paper}>
			{selected.length > 0 && (
				<TableToolbar selected={selected} handleDelete={handleDelete} />
			)}
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Item</TableCell>
							<TableCell align="right">Price</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{items.length > 0 &&
							items
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(item => (
									<TableRow
										key={item._id}
										hover
										onClick={event => handleClick(event, item._id)}
										className={clsx({
											[classes.highlight]: selected.indexOf(item._id) !== -1
										})}
									>
										<TableCell component="th" scope="row">
											{item.name}
										</TableCell>
										<TableCell align="right">{item.price}</TableCell>
									</TableRow>
								))}

						{emptyRows > 0 && (
							<TableRow style={{ height: 33 * emptyRows }}>
								<TableCell colSpan={2} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10]}
				component="div"
				className={classes.pagination}
				count={items.length}
				rowsPerPage={rowsPerPage}
				labelRowsPerPage={"Rows:"}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
