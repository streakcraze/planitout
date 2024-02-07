import React from "react";
import ReactLoading from "react-loading";

//MUI
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	container: {
		height: "100vh",
		background: "linear-gradient(100deg, #ff9800, #cddc39)"
	},
	loadingUI: {
		position: "absolute",
		left: "50%",
		top: "35%",
		transform: "translate(-50%, -50%)"
	}
});

export default function Loading() {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<ReactLoading
				type={"spokes"}
				color={"blue"}
				width={200}
				className={classes.loadingUI}
			/>
		</div>
	);
}
