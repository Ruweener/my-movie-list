import express from "express";
const router = express.Router();

router.get("/:id", async (req, res) => {
	const movieId = req.params.id;
	const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const url = `${baseUrl}/movie/${movieId}/watch/providers?api_key=${apiKey}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			const text = await response.text();
			console.error("TMDB API error:", response.status, text);
			return res.status(response.status).json({
				error: "TMDB API error",
				status: response.status,
				body: text,
			});
		}
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error fetching movie providers:", error);
		res.status(500).json({
			error: "Failed to fetch movie providers",
			body: error.message,
		});
	}
});

export default router;
