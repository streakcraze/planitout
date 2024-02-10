import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
	const sxStyles = {
		root: {
			height: "100vh",
			background: "linear-gradient(100deg, #ff9800, #cddc39)",
		},
		container: {
			position: "absolute",
			left: "50%",
			top: "50%",
			transform: "translate(-50%, -50%)",
		},
	};

	return (
		<div style={{ ...sxStyles.root }}>
			<div style={{ ...sxStyles.container }}>
				<ReactLoading type={"spokes"} color={"blue"} height={200} width={200} />
			</div>
		</div>
	);
}
