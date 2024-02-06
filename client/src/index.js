import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserContextProvider from "./context/UserContext";
import BudgetContextProvider from "./context/BudgetContext";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

//MUI
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#2196f3"
		},
		secondary: {
			main: "#4caf50"
		}
	}
});

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<UserContextProvider>
			<BudgetContextProvider>
				<Router>
					<App />
				</Router>
			</BudgetContextProvider>
		</UserContextProvider>
	</ThemeProvider>,
	document.getElementById("root")
);
