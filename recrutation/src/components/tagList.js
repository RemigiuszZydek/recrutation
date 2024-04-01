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
	FormControl,
	Select,
	MenuItem,
	TextField,
} from "@mui/material";

const useStyles = makeStyles({
	tableContainer: {
		marginTop: 20,
	},
	formControl: {
		margin: "20px 0",
		minWidth: 120,
	},
	select: {
		padding: "8px",
		backgroundColor: "#f0f0f0",
		borderRadius: "4px",
	},
	pageButton: {
		margin: "8px",
		padding: "12px",
		borderRadius: "4px",
		boxShadow: "none",
	},
	textField: {
		margin: "20px 0",
		width: 120,
	},
});

const AllTagsTable = () => {
	const classes = useStyles();
	const [tags, setTags] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [tagsPerPage, setTagsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await axios.get(
					"https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow"
				);
				setTags(response.data.items);
				const totalTags = response.data.items.length;
				setTotalPages(Math.ceil(totalTags / tagsPerPage));
			} catch (error) {
				console.error("Error fetching tags: ", error);
			}
		};
		fetchTags();
	}, [tagsPerPage]);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleTagsPerPageChange = (event) => {
		setTagsPerPage(event.target.value);
	};

	const handleInputChange = (event) => {
		const value = parseInt(event.target.value);
		setTagsPerPage(value);
	};

	const startIndex = (currentPage - 1) * tagsPerPage;
	const endIndex = startIndex + tagsPerPage;
	const currentTags = tags.slice(startIndex, endIndex);

	return (
		<React.Fragment>
			<Grid container alignItems="center">
				<Grid item xs={6} sm={4}>
					<TextField
						className={classes.textField}
						label="Ilosc Tagow"
						variant="outlined"
						type="number"
						value={tagsPerPage}
						onChange={handleInputChange}
						inputProps={{ min: 1 }}
					/>
				</Grid>
			</Grid>
			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">Count</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{currentTags.map((tag) => (
							<TableRow key={tag.name}>
								<TableCell component="th" scope="row">
									{tag.name}
								</TableCell>
								<TableCell align="right">{tag.count}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
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
		</React.Fragment>
	);
};

export default AllTagsTable;
