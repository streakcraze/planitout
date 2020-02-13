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
	const { register, userLoading } = useContext(UserContext);
	const history = useHistory();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		switch (name) {
			case "username":
				setUsername(value);
				break;
			case "email":
				setEmail(value);
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
		else if (email.trim() === "")
			setErrors({ ...errors, email: "field must not be empty" });
		else if (password.trim() === "")
			setErrors({ ...errors, password: "field must not be empty" });
		else if (username.trim().length < 2 || username.trim().length > 15)
			setErrors({
				...errors,
				username: "username must be between 2 and 15 characters long"
			});
		else if (email.trim().length > 30)
			setErrors({ ...errors, email: "email is too long" });
		else if (
			!email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		)
			setErrors({ ...errors, email: "invalid email" });
		else if (password.trim().length < 8 || password.trim().length > 20)
			setErrors({
				...errors,
				password: "password must be between 8 and 20 characters long"
			});
		else {
			const newUser = { username, email, password };
			register(newUser)
				.then(() => history.push("/"))
				.catch(err => setErrors(err));
		}
	};

	return userLoading ? (
		<Loading />
	) : (
		<div className={classes.container}>
			<Typography variant="h4" gutterBottom color="secondary">
				SIGNUP
			</Typography>
			{errors.register && (
				<div className={classes.errors}>
					<p>{errors.register}</p>
				</div>
			)}
			<form noValidate autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					label="Username"
					name="username"
					value={username}
					error={errors.username ? true : false}
					helperText={errors.username}
					fullWidth
					onChange={handleChange}
					className={classes.inputField}
				/>
				<TextField
					label="Email"
					name="email"
					value={email}
					error={errors.email ? true : false}
					helperText={errors.email}
					fullWidth
					onChange={handleChange}
					className={classes.inputField}
				/>
				<TextField
					label="Password"
					name="password"
					type={showPassword ? "text" : "password"}
					value={password}
					error={errors.password ? true : false}
					helperText={errors.password}
					fullWidth
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
					already a user? <a href="/login">login</a>
				</span>
				<Button
					type="submit"
					variant="contained"
					color="secondary"
					className={classes.submitButton}
				>
					signup
				</Button>
			</form>
		</div>
	);
}
