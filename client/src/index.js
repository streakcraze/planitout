import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import "./index.css";
import UserContextProvider from "./context/UserContext";
import BudgetContextProvider from "./context/BudgetContext";

//MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#2196f3",
		},
		secondary: {
			main: "#4caf50",
		},
	},
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<ThemeProvider theme={theme}>
		<UserContextProvider>
			<BudgetContextProvider>
				<Router>
					<App />
				</Router>
			</BudgetContextProvider>
		</UserContextProvider>
	</ThemeProvider>
);
