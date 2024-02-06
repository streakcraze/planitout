import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	container: {
		padding: 30,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	inputField: {
		display: "block",
		marginBottom: 30,
		width: 300,
		[theme.breakpoints.down("xs")]: {
			width: 250
		}
	},
	submitButton: {
		display: "block",
		margin: "20px auto 0",
		width: 100
	},
	errors: {
		backgroundColor: "#f4f4f4",
		padding: 10,
		lineHeight: "0",
		textAlign: "center"
	}
}));

export default function Login() {
	const classes = useStyles();
	const history = useHistory();
	const { login, userLoading } = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		switch (name) {
			case "username":
				setUsername(value);
				break;
			case "password":
				setPassword(value);
				break;
			default:
				return null;
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (username.trim() === "")
			setErrors({ ...errors, username: "field must not be empty" });
		else if (password.trim() === "")
			setErrors({ ...errors, password: "field must not be empty" });
		else {
			const user = {
				username,
				password
			};
			login(user)
				.then(() => history.push("/"))
				.catch(err => setErrors(err));
		}
	};

	return userLoading ? (
		<Loading />
	) : (
		<div className={classes.container}>
			<Typography variant="h4" gutterBottom color="secondary">
				LOGIN
			</Typography>
			{errors.login && (
				<div className={classes.errors}>
					<p>{errors.login}</p>
				</div>
			)}
			<form noValidate autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					label="Username"
					name="username"
					fullWidth
					error={errors.username ? true : false}
					helperText={errors.username}
					onChange={handleChange}
					className={classes.inputField}
				/>
				<TextField
					label="Password"
					name="password"
					type={showPassword ? "text" : "password"}
					fullWidth
					error={errors.password ? true : false}
					helperText={errors.password}
					onChange={handleChange}
					autoComplete="current-password"
					className={classes.inputField}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
								>
									{showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						)
					}}
				/>
				<span>
					not a user yet? <a href="/signup">signup</a>
				</span>
				<Button
					type="submit"
					variant="contained"
					color="secondary"
					className={classes.submitButton}
				>
					login
				</Button>
			</form>
		</div>
	);
}
