import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Navbar() {
	const navigate = useNavigate();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const handleLogout = () => {
		if (window.confirm("Sure you want to log out?")) {
			window.localStorage.removeItem("budget-token");
			window.location.reload();
		}
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: "center", background: "#BF80FF", height: "100%" }}
		>
			<List>
				<ListItem key="0" disablePadding>
					<ListItemButton
						sx={{ textAlign: "center", textTransform: "uppercase" }}
						onClick={() => navigate("/")}
					>
						<ListItemText primary="home" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<ListItem key="1" disablePadding>
					<ListItemButton
						sx={{ textAlign: "center", textTransform: "uppercase" }}
					>
						<ListItemText primary="analytics" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<ListItem key="2" disablePadding>
					<ListItemButton
						sx={{ textAlign: "center", textTransform: "uppercase" }}
						onClick={() => navigate("/profile")}
					>
						<ListItemText primary="profile" />
					</ListItemButton>
				</ListItem>
				<Divider />
				<Divider sx={{ mt: 10 }} />
				<ListItem key="3" disablePadding>
					<ListItemButton
						sx={{ textAlign: "center", textTransform: "uppercase" }}
						onClick={handleLogout}
					>
						<ListItemText primary="logout" />
					</ListItemButton>
				</ListItem>
				<Divider />
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				component="nav"
				sx={{ background: "linear-gradient(100deg, #7F00FF, #311432)" }}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h4"
						component="div"
						sx={{ flexGrow: 1, display: "block" }}
					>
						BUDGET CALCULATOR
					</Typography>
					<Box
						sx={{
							flexGrow: 2,
							display: { xs: "none", sm: "flex" },
						}}
					>
						<Box
							sx={{
								flexGrow: 1,
								display: "flex",
								justifyContent: "space-around",
							}}
						>
							<Button sx={{ color: "#fff" }} onClick={() => navigate("/")}>
								home
							</Button>
							<Button sx={{ color: "#fff" }}>analytics</Button>
							<Button
								sx={{ color: "#fff" }}
								onClick={() => navigate("/profile")}
							>
								profile
							</Button>
						</Box>
						<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "end" }}>
							<Button sx={{ color: "#fff" }} onClick={handleLogout}>
								logout
							</Button>
						</Box>
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: 240,
						},
					}}
				>
					{drawer}
				</Drawer>
			</nav>
		</Box>
	);
}
