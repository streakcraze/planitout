import React, { useState, useContext, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";

//MUI
import Typography from "@mui/material/Typography";

export default function BudgetTotal({ category }) {
	let { items } = useContext(BudgetContext);
	items = items.filter((item) => item.category === category);

	useEffect(() => {
		const prices = items.map((row) => row.price);
		setTotal(prices.reduce((a, b) => a + b, 0));
	}, [items]);

	const [total, setTotal] = useState(0);

	const sxStyles = {
		priceTotal: {
			margin: "30px",
			textAlign: "right",
		},
	};

	return (
		<Typography variant="h5" gutterBottom sx={{ ...sxStyles.priceTotal }}>
			TOTAL: {total}
		</Typography>
	);
}
