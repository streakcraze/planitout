import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

import Typography from "@mui/material/Typography";

export default function Profile() {
	const { user } = useContext(UserContext);

	return (
		<div style={{ padding: 20, position: "relative", width: 350 }}>
			<Typography
				variant="h4"
				gutterBottom
				color="secondary"
				sx={{ textAlign: "center" }}
			>
				PROFILE
			</Typography>
			<p>USERNAME: {user.username}</p>
			<p>EMAIL: {user.email}</p>
		</div>
	);
}
