import express from "express";
const router = express.Router();

router.get('/:genreId', async (req, res) => {
	const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const { genreId } = req.params;
	const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			const text = await response.text();
			console.error("TMDB API error:", response.status, text);
			return res.status(response.status).json({
				error: "TMDB API error",
				status: response.status,
				body: text
			});
		}
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error fetching movies by genre:", error);
		res.status(500).json({
			error: "Failed to fetch movies by genre",
			body: error.message
		});
	}
});

export default router;
