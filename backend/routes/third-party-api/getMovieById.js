import express from "express";
const router = express.Router();

router.get("/:id", async (req, res) => {
	const movieId = req.params.id;
	const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			const errorText = await response.text();
			console.error("TMDB API error:", response.status, errorText);
			return res.status(response.status).json({
				status: response.status,
				body: errorText,
			});
		}
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error fetching movie by ID:", error);
		res.status(500).json({
			error: "Failed to fetch movie by ID",
			body: error.message,
		});
	}
});

export default router;
