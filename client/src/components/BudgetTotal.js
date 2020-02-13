import React, { useState, useContext, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
	priceTotal: {
		margin: 30,
		textAlign: "right"
	}
});

export default function BudgetTotal({ category }) {
	const classes = useStyles();
	let { items } = useContext(BudgetContext);
	items = items.filter(item => item.category === category);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const prices = items.map(row => row.price);
		setTotal(prices.reduce((a, b) => a + b, 0));
	}, [items]);

	return (
		<Typography variant="h5" gutterBottom className={classes.priceTotal}>
			TOTAL: {total}
		</Typography>
	);
}
