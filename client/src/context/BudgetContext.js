import React, { createContext, useState } from "react";
import axios from "axios";

export const BudgetContext = createContext();

export default function BudgetContextProvider(props) {
	const [categories, setCategories] = useState([]);
	const [items, setItems] = useState([]);
	const [itemsLoading, setItemsLoading] = useState(false);
	const [errors, setErrors] = useState(null);
	const [editItem, setEditItem] = useState(null);

	const URI = "https://planitout-server.vercel.app";

	const getCategories = (itemsData) => {
		setCategories([...new Set(itemsData.map((item) => item.category))]);
	};

	const addCategory = (category) => {
		setCategories([...categories, category]);
	};

	const getItems = () => {
		setItemsLoading(true);

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
			.get(URI + "/api/items", config)
			.then((res) => {
				setItemsLoading(false);
				setItems(res.data);
				getCategories(res.data);
			})
			.catch((err) => {
				setErrors(err);
				console.log(err);
			});
	};

	const addItems = (item) => {
		setItemsLoading(true);

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
			.post(URI + "/api/items", item, config)
			.then((res) => {
				setItemsLoading(false);
				console.log(res.data);
				getItems();
			})
			.catch((err) => {
				setErrors(err);
				console.log(errors);
			});
	};

	const deleteItems = (ids) => {
		setItemsLoading(true);
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
			.delete(URI + "/api/items", { ...config, data: ids })
			.then((res) => {
				setItemsLoading(false);
				console.log(res.data);
				getItems();
			})
			.catch((err) => {
				setErrors(err);
				console.log(errors);
			});
	};

	const findItem = (event, id) => {
		setEditItem([...items].filter((row) => row._id === id)[0]);
	};

	const updateItem = (editObj) => {
		setItemsLoading(true);
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
			.put(URI + "/api/items", editObj, config)
			.then((res) => {
				setItemsLoading(false);
				console.log(res.data);
				getItems();
			})
			.catch((err) => {
				setErrors(err);
				console.log(errors);
			});
		setEditItem(null);
	};

	const updateCategory = (currentCategory, newCategory) => {
		setItemsLoading(true);
		const updateObj = { currentCategory, newCategory };
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
			.put(URI + "/api/items/category", updateObj, config)
			.then((res) => {
				setItemsLoading(false);
				console.log(res.data);
				getItems();
			})
			.catch((err) => {
				setErrors(err);
				console.log(errors);
			});
	};

	return (
		<BudgetContext.Provider
			value={{
				items,
				getItems,
				itemsLoading,
				categories,
				addCategory,
				updateCategory,
				addItems,
				deleteItems,
				editItem,
				findItem,
				updateItem,
			}}
		>
			{props.children}
		</BudgetContext.Provider>
	);
}
