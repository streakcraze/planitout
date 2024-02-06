import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { isAuthenticated } = useContext(UserContext);

	return (
		<Route
			{...rest}
			render={props => {
				if (isAuthenticated) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: "/login",
								state: {
									from: props.location
								}
							}}
						/>
					);
				}
			}}
		></Route>
	);
};
