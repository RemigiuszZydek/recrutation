import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
} from "@mui/material";

const useStyles = makeStyles({
	root: {
		backgroundColor: "#333",
		padding: "20px",
		color: "#fff",
	},
	title: {
		fontSize: "24px",
		fontWeight: "bold",
		marginBottom: "20px",
	},
	tableContainer: {
		marginTop: "20px",
		backgroundColor: "#444",
		padding: "10px",
		borderRadius: "4px",
	},
	table: {
		backgroundColor: "#555",
	},
	tableCell: {
		color: "#fff",
	},
	pageButton: {
		margin: "8px",
		padding: "12px",
		borderRadius: "4px",
		boxShadow: "none",
		backgroundColor: "#666",
		color: "#fff",
	},
	textField: {
		margin: "20px 0",
		width: "120px",
		color: "#fff",
	},
	formControl: {
		margin: "20px 0",
		width: "200px",
		color: "#fff",
	},
});

const AllTagsTable = () => {
	const classes = useStyles();
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [tagsPerPage, setTagsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [sortBy, setSortBy] = useState("count_desc"); // Default sort by count descending

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/tags");
				console.log("Dane z serwera proxy:", response.data);
				let sortedTags = response.data.items;
				if (sortBy === "count_desc") {
					sortedTags = sortedTags.sort((a, b) => b.count - a.count);
				} else if (sortBy === "count_asc") {
					sortedTags = sortedTags.sort((a, b) => a.count - b.count);
				} else if (sortBy === "name_desc") {
					sortedTags = sortedTags.sort((a, b) => b.name.localeCompare(a.name));
				} else if (sortBy === "name_asc") {
					sortedTags = sortedTags.sort((a, b) => a.name.localeCompare(b.name));
				}
				setTags(sortedTags);
				setLoading(false);
				const totalTags = sortedTags.length;
				setTotalPages(Math.ceil(totalTags / tagsPerPage));
			} catch (error) {
				setError(`Error fetching tags: ${error.message}`);
				setLoading(false);
				console.error("Error fetching tags: ", error);
			}
		};
		fetchTags();
	}, [tagsPerPage, sortBy]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleInputChange = (event) => {
		const value = parseInt(event.target.value);
		setTagsPerPage(value);
	};

	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	const startIndex = (currentPage - 1) * tagsPerPage;
	const endIndex = startIndex + tagsPerPage;
	const currentTags = tags.slice(startIndex, endIndex);

	return (
		<div className={classes.root}>
			<div className={classes.title}>Praca Rekrutacyjna</div>
			<Grid container alignItems="center">
				<Grid item xs={6} sm={4}>
					<TextField
						className={classes.textField}
						label="Tags per page"
						variant="outlined"
						type="number"
						value={tagsPerPage}
						onChange={handleInputChange}
						inputProps={{ min: 1 }}
					/>
				</Grid>
				<Grid item xs={6} sm={4}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="sort-by-label">Sort by</InputLabel>
						<Select
							labelId="sort-by-label"
							id="sort-by-select"
							value={sortBy}
							onChange={handleSortChange}
							label="Sort by"
						>
							<MenuItem value={"count_desc"}>Count (desc)</MenuItem>
							<MenuItem value={"count_asc"}>Count (asc)</MenuItem>
							<MenuItem value={"name_desc"}>Name (desc)</MenuItem>
							<MenuItem value={"name_asc"}>Name (asc)</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			{loading ? (
				<CircularProgress />
			) : error ? (
				<div>{error}</div>
			) : (
				<TableContainer component={Paper} className={classes.tableContainer}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell className={classes.tableCell}>Name</TableCell>
								<TableCell align="right" className={classes.tableCell}>
									Count
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{currentTags.map((tag) => (
								<TableRow key={tag.name}>
									<TableCell
										component="th"
										scope="row"
										className={classes.tableCell}
									>
										{tag.name}
									</TableCell>
									<TableCell align="right" className={classes.tableCell}>
										{tag.count}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<div>
				{Array.from({ length: totalPages }, (_, index) => index + 1).map(
					(pageNumber) => (
						<Button
							key={pageNumber}
							onClick={() => handlePageChange(pageNumber)}
							variant={currentPage === pageNumber ? "contained" : "outlined"}
							className={classes.pageButton}
						>
							{pageNumber}
						</Button>
					)
				)}
			</div>
		</div>
	);
};

export default AllTagsTable;
