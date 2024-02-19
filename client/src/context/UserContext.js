import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextProvider(props) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState({});
	const [userLoading, setUserLoading] = useState(false);

	const URI = "http://localhost:4000";

	const register = (newUser) => {
		setUserLoading(true);

		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			axios
				.post(URI + "/api/users/register", newUser, config)
				.then((res) => {
					setUserLoading(false);
					console.log(res);
					resolve({ emailSent: true });
				})
				.catch((err) => {
					setUserLoading(false);
					if (err.code === "ERR_NETWORK") {
						window.alert(
							err.message +
								": Check your internet connection and reload the page."
						);
					} else {
						console.log(err);
						reject({ emailSent: false });
					}
				});
		});
	};

	const login = (user) => {
		setUserLoading(true);

		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			axios
				.post(URI + "/api/users/login", user, config)
				.then((res) => {
					window.localStorage.setItem("budget-token", res.data.user.token);
					setIsAuthenticated(true);
					setUser(res.data.user);
					setUserLoading(false);
					resolve();
				})
				.catch((err) => {
					setUserLoading(false);
					if (err.code === "ERR_NETWORK") {
						window.alert(
							err.message +
								": Check your internet connection and reload the page."
						);
					} else {
						reject({ login: err.response.data.msg });
					}
				});
		});
	};

	const loadUser = () => {
		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const token = window.localStorage.getItem("budget-token");

			if (token) {
				config.headers["x-auth-token"] = token;
			}

			axios
				.get(URI + "/api/users", config)
				.then((res) => {
					setIsAuthenticated(true);
					setUser(res.data);
					resolve();
				})
				.catch((err) => {
					if (err.code === "ERR_NETWORK") {
						window.alert(
							err.message +
								": Check your internet connection and reload the page."
						);
					} else {
						reject({ loadUser: err.response.data.msg });
					}
				});
		});
	};

	const resetPassword = (userEmail) => {
		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			axios
				.post(URI + "/api/users/passwordResetEmail", userEmail, config)
				.then((res) => {
					resolve({ passwordReset: res.data.msg });
				})
				.catch((err) => {
					if (err.code === "ERR_NETWORK") {
						window.alert(
							err.message +
								": Check your internet connection and reload the page."
						);
					} else {
						reject({ passwordReset: err.response.data.msg });
					}
				});
		});
	};

	return (
		<UserContext.Provider
			value={{
				isAuthenticated,
				user,
				userLoading,
				register,
				login,
				loadUser,
				resetPassword,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
}
