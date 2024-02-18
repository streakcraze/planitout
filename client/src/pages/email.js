import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function EmailVerification() {
	const navigate = useNavigate();
	const { emailSent } = useParams();

	return (
		<div style={{ padding: 20, position: "relative", width: 350 }}>
			<Typography
				variant="h4"
				gutterBottom
				color="secondary"
				sx={{ textAlign: "center" }}
			>
				VERIFY EMAIL
			</Typography>
			{emailSent === "true" ? (
				<>
					<p>
						A link has been sent to your email inbox. Use it to verify your
						email before logging in.
					</p>
					<p style={{ textAlign: "center" }}>
						<b>after verifying email:</b>
					</p>
					<Button
						type="button"
						variant="contained"
						color="secondary"
						sx={{ display: "block", margin: "auto" }}
						onClick={() => navigate("/login")}
					>
						login
					</Button>
				</>
			) : (
				<p>Error sending email verification link. Please sign up again.</p>
			)}
		</div>
	);
}
