import React from "react";
import AllTagsTable from "./components/tagList";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<AllTagsTable />
		</ThemeProvider>
	);
};

export default App;
