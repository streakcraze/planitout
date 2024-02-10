import React, { useState, useContext, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import TableToolbar from "./TableToolbar";
import clsx from "clsx";

//MUI
import { useMediaQuery } from "@mui/material";
import { lighten } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

export default function BudgetTable({ category }) {
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	let { items, deleteItems, editItem } = useContext(BudgetContext);
	items = items.filter((item) => item.category === category);

	useEffect(() => {
		if (editItem) {
			setSelected([]);
		}
	}, [editItem]);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [selected, setSelected] = useState([]);

	const sxStyles = {
		paper: {
			maxWidth: smallScreen ? 280 : 400,
			margin: smallScreen ? "20px 15px" : "20px auto",
		},
		highlight: {
			color: (theme) => theme.palette.secondary.main,
			backgroundColor: (theme) => lighten(theme.palette.secondary.light, 0.85),
		},
		pagination: {
			"& .MuiTablePagination-input": {
				marginLeft: 0,
			},
			"& .MuiButtonBase-root": {
				paddingLeft: 0,
			},
		},
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

	const handleClick = (event, id) => {
		if (selected.indexOf(id) === -1) {
			setSelected([...selected, id]);
		} else {
			setSelected([...selected].filter((item) => item !== id));
		}
	};

	const handleDelete = (event, items) => {
		deleteItems(items);
		setSelected([]);
	};

	return (
		<Paper elevation={3} sx={{ ...sxStyles.paper }}>
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
								.map((item) => (
									<TableRow
										key={item._id}
										hover
										onClick={(event) => handleClick(event, item._id)}
										className={clsx({
											[sxStyles.highlight]: selected.indexOf(item._id) !== -1,
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
				sx={{ ...sxStyles.pagination }}
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
