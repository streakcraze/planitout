import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Category({ category, sxStyles }) {
	const navigate = useNavigate();
	const [hoverStyles, setHoverStyles] = useState({});

	return (
		<button
			style={{
				...sxStyles,
				...hoverStyles,
			}}
			onMouseEnter={(e) => {
				setHoverStyles({
					cursor: "pointer",
					backgroundColor: "#a9a9a9",
					transform: "scale(1.05)",
				});
			}}
			onMouseLeave={(e) => {
				setHoverStyles({});
			}}
			onClick={() => navigate(`/items/${category}`)}
		>
			{category}
		</button>
	);
}
