import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
	const sxStyles = {
		container: {
			height: "100vh",
			background: "linear-gradient(100deg, #ff9800, #cddc39)",
		},
		loadingUI: {
			position: "absolute",
			left: "50%",
			top: "35%",
			transform: "translate(-50%, -50%)",
		},
	};

	return (
		<div style={{ ...sxStyles.container }}>
			<ReactLoading
				type={"spokes"}
				color={"blue"}
				width={200}
				style={{ ...sxStyles.loadingUI }}
			/>
		</div>
	);
}
