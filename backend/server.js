import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = new URL(".", import.meta.url).pathname;

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
	res.send("Welcome to the Movie Reviewer API");
});

app.get("/api/movies/popular", async (req, res) => {
	const apiKey = process.env.THEMOVIEDB_API_KEY;
	const baseUrl = process.env.THEMOVIEDB_BASE_URL;
	const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
	
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
		console.error("Error fetching popular movies:", error);
		res.status(500).json({
			error: "Failed to fetch popular movies",
			details: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
