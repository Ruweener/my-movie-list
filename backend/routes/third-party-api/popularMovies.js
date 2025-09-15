import express from "express";
const router = express.Router();

router.get('/', async (req, res) => {
    const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1&adult=false`;
	
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
		console.error("Error fetching popular movies:", error);
		res.status(500).json({
			error: "Failed to fetch popular movies",
			body: error.message
		});
	}
});

export default router;