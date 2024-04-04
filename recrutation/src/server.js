const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/tags", async (req, res) => {
	try {
		const response = await axios.get(
			"https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow"
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching tags: ", error);
		res.status(500).json({ error: "Error fetching tags" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
