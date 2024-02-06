import React, { useContext, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Loading from "./components/Loading";

//pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
	container: {
		margin: "20px 0",
		display: "flex",
		flexDirection: "column",
		width: "100%",
		minHeight: "100vh",
		alignItems: "center",
		justifyContent: "center",
		"& .app-name": {
			marginBottom: 10,
			[theme.breakpoints.down("xs")]: {
				textTransform: "capitalize"
			},
			[theme.breakpoints.up("sm")]: {
				textTransform: "uppercase"
			}
		}
	}
}));

function App() {
	const classes = useStyles();
	const { loadUser, isAuthenticated } = useContext(UserContext);
	const [auth, setAuth] = useState(false);

	useEffect(() => {
		loadUser().then(() => setAuth(true));
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
				<div className={classes.container}>
					<Typography variant="h4" gutterBottom className="app-name">
						budget calculator
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
						<Switch>
							<ProtectedRoute exact path="/" component={Home} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/signup" component={Signup} />
							<ProtectedRoute
								exact
								path="/items/:category"
								component={Dashboard}
							/>
							<Route path="*" component={() => "404 NOT FOUND"} />
						</Switch>
					</Paper>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}

export default App;
