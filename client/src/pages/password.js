import React, { useState, useContext } from "react";
import ReactLoading from "react-loading";
import { UserContext } from "../context/UserContext";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function PasswordReset() {
	const { resetPassword } = useContext(UserContext);
	const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState({});
	const [response, setResponse] = useState("");
	const [responseLoading, setResponseLoading] = useState(false);

	const sxStyles = {
		container: {
			padding: 20,
			position: "relative",
			width: 350,
		},
		inputField: {
			display: "block",
			margin: "10px auto",
			width: smallScreen ? 250 : 300,
		},
		submitButton: {
			display: "block",
			margin: "20px auto 0",
			width: 100,
		},
		response: {
			backgroundColor: "#f4f4f4",
			border: "1px dashed black",
			borderRadius: 10,
			padding: 5,
			textAlign: "center",
		},
		loadingUI: {
			position: "absolute",
			left: "50%",
			top: "80%",
			transform: "translate(-50%, -50%)",
		},
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") {
			setEmail(value);
		} else {
			return null;
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email.trim() === "")
			setErrors({ ...errors, email: "field must not be empty" });
		else if (email.trim().length > 30)
			setErrors({ ...errors, email: "input is too long" });
		else if (
			!email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		)
			setErrors({ ...errors, email: "invalid email" });
		else {
			setResponseLoading(true);
			const userEmail = { email };
			resetPassword(userEmail)
				.then((res) => {
					setResponseLoading(false);
					setResponse(res.passwordReset);
				})
				.catch((err) => {
					setResponseLoading(false);
					setResponse(err.passwordReset);
				});
		}
	};

	return (
		<div style={{ ...sxStyles.container }}>
			<Typography
				variant="h4"
				gutterBottom
				color="secondary"
				sx={{ textAlign: "center" }}
			>
				RESET PASSWORD
			</Typography>
			<p>Enter email address to receive link for resetting your password:</p>
			<form noValidate autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					label="Email"
					name="email"
					fullWidth
					error={errors.email ? true : false}
					helperText={errors.email}
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
			{responseLoading && (
				<div style={{ ...sxStyles.loadingUI }}>
					<ReactLoading type={"bars"} color={"#3792cb"} width={100} />
				</div>
			)}
			{response && <p style={{ ...sxStyles.response }}>{response}</p>}
		</div>
	);
}
