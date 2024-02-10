import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Loading from "./components/Loading";

//pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

//MUI
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const sxStyles = {
	container: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		minHeight: "100vh",
		alignItems: "center",
		justifyContent: "center",
		margin: "10px auto",
	},
};

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

	const handleLogout = () => {
		if (window.confirm("Sure you want to log out?")) {
			window.localStorage.removeItem("budget-token");
			window.location.reload();
		}
	};

	return (
		<>
			{auth ? (
				<div style={{ ...sxStyles.container }}>
					<Typography variant="h4" gutterBottom>
						BUDGET CALCULATOR
					</Typography>
					{isAuthenticated && (
						<span
							onClick={handleLogout}
							style={{ marginBottom: 20, cursor: "pointer" }}
						>
							&#8592;logout
						</span>
					)}
					<Paper elevation={3}>
						<Routes>
							<Route
								exact
								path="/"
								element={<ProtectedRoute component={Home} />}
							/>
							<Route exact path="/login" element={<Login />} />
							<Route exact path="/signup" element={<Signup />} />
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
