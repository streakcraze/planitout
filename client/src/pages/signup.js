import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

//MUI
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";

const sxStyles = {
	container: {
		padding: 30,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	inputField: {
		display: "block",
		marginBottom: 5,
		width: 300,
	},
	submitButton: {
		display: "block",
		margin: "20px auto 0",
		width: 100,
	},
	errors: {
		backgroundColor: "#f4f4f4",
		padding: 10,
		lineHeight: "0",
		textAlign: "center",
	},
};

export default function Login() {
	const { register, userLoading } = useContext(UserContext);
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
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

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = (e) => {
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
				username: "username must be between 2 and 15 characters long",
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
				password: "password must be between 8 and 20 characters long",
			});
		else {
			const newUser = { username, email, password };
			register(newUser)
				.then(() => navigate("/"))
				.catch((err) => setErrors(err));
		}
	};

	return userLoading ? (
		<Loading />
	) : (
		<div style={{ ...sxStyles.container }}>
			<Typography variant="h4" gutterBottom color="secondary">
				SIGNUP
			</Typography>
			{errors.register && (
				<div style={{ ...sxStyles.errors }}>
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
					variant="standard"
					onChange={handleChange}
					sx={(theme) => ({
						...sxStyles.inputField,
						[theme.breakpoints.down("xs")]: {
							width: 250,
						},
					})}
				/>
				<TextField
					label="Email"
					name="email"
					value={email}
					error={errors.email ? true : false}
					helperText={errors.email}
					fullWidth
					variant="standard"
					onChange={handleChange}
					sx={(theme) => ({
						...sxStyles.inputField,
						[theme.breakpoints.down("xs")]: {
							width: 250,
						},
					})}
				/>
				<TextField
					label="Password"
					name="password"
					type={showPassword ? "text" : "password"}
					value={password}
					error={errors.password ? true : false}
					helperText={errors.password}
					fullWidth
					variant="standard"
					onChange={handleChange}
					autoComplete="current-password"
					sx={(theme) => ({
						...sxStyles.inputField,
						[theme.breakpoints.down("xs")]: {
							width: 250,
						},
					})}
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
						),
					}}
				/>
				<span>
					already a user? <a href="/login">login</a>
				</span>
				<Button
					type="submit"
					variant="contained"
					color="secondary"
					sx={{ ...sxStyles.submitButton }}
				>
					signup
				</Button>
			</form>
		</div>
	);
}
