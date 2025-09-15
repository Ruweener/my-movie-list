import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
    const searchQuery = req.query.searchquery;
	const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`;
	
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
		console.error("Error searching for movies:", error);
		res.status(500).json({
			error: "Failed to search for movies",
			body: error.message
		});
	}
});

export default router;