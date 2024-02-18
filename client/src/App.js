import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";

// pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Profile from "./pages/profile";
import EmailVerification from "./pages/email";

// components
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";

// MUI
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

function App() {
	const { loadUser, isAuthenticated } = useContext(UserContext);
	const [auth, setAuth] = useState(false);

	useEffect(() => {
		loadUser()
			.then(() => setAuth(true))
			.catch((err) => {
				console.log(err.loadUser);
				setAuth(true);
			});
	}, []);

	const sxStyles = {
		container: {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			minHeight: "100vh",
			alignItems: "center",
			justifyContent: "center",
			margin: "40px auto",
		},
	};

	return (
		<>
			{auth ? (
				<div style={{ ...sxStyles.container }}>
					{isAuthenticated ? (
						<Navbar />
					) : (
						<Typography variant="h4" gutterBottom>
							BUDGET CALCULATOR
						</Typography>
					)}
					<Paper elevation={3}>
						<Routes>
							<Route exact path="/login" element={<Login />} />
							<Route exact path="/signup" element={<Signup />} />
							<Route
								exact
								path="/verifyEmail/:emailSent"
								element={<EmailVerification />}
							/>
							<Route
								exact
								path="/"
								element={<ProtectedRoute component={Home} />}
							/>
							<Route
								exact
								path="/profile"
								element={<ProtectedRoute component={Profile} />}
							/>
							<Route
								exact
								path="/items/:category"
								element={<ProtectedRoute component={Dashboard} />}
							/>
							<Route path="*" element={() => "404 NOT FOUND"} />
						</Routes>
					</Paper>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}

export default App;
