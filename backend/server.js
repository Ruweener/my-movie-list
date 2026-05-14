import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = new URL(".", import.meta.url).pathname;

mongoose.connect(process.env.MONGODB_URI).catch((err) => {
	console.error("Failed to connect to MongoDB", err);
	process.exit(1);
});

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
	res.send("Welcome to the Movie Reviewer API");
});

app.use(
	"/api/movies/popular",
	(await import("./routes/third-party-api/popularMovies.js")).default
);
app.use(
	"/api/movies/search",
	(await import("./routes/third-party-api/searchMovies.js")).default
);
app.use(
	"/api/movies/genres",
	(await import("./routes/third-party-api/getGenres.js")).default
);
app.use(
	"/api/movies/genre",
	(await import("./routes/third-party-api/getMoviesByGenre.js")).default
);
app.use(
	"/api/movies/providers",
	(await import("./routes/third-party-api/getMovieProviders.js")).default
);
app.use(
	"/api/movies",
	(await import("./routes/third-party-api/getMovieById.js")).default
);

app.use("/api/reviews", (await import("./routes/api/reviewMovies.js")).default);
app.use("/api/watchlist", (await import("./routes/api/watchlist.js")).default);

const cleanupLegacyReviewIndexes = async () => {
	try {
		const collection = mongoose.connection.collection("moviereviewmodels");
		const indexes = await collection.indexes();
		const legacyMovieIdIndex = indexes.find((index) => index.name === "movieId_1" && index.unique);

		if (legacyMovieIdIndex) {
			await collection.dropIndex("movieId_1");
			console.log("Dropped legacy unique index: movieId_1");
		}
	} catch (error) {
		// Collection may not exist yet on a fresh DB; that's safe to ignore.
		if (error.codeName !== "NamespaceNotFound") {
			console.error("Failed cleaning review indexes:", error.message);
		}
	}
};

mongoose.connection.once("open", async () => {
	console.log("Connected to MongoDB");
	await cleanupLegacyReviewIndexes();
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
