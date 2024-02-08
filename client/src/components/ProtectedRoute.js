import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ component: Component }) => {
	const { isAuthenticated } = useContext(UserContext);
	const location = useLocation();

	return isAuthenticated ? (
		<Component />
	) : (
		<Navigate to="/login" state={{ from: location }} />
	);
};
