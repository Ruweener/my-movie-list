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
	"/api/movies",
	(await import("./routes/third-party-api/getMovieById.js")).default
);

app.use(
	"/api/movies/popular",
	(await import("./routes/third-party-api/popularMovies.js")).default
);
app.use(
	"/api/movies/search",
	(await import("./routes/third-party-api/searchMovies.js")).default
);

app.use("/api/reviews", (await import("./routes/api/reviewMovies.js")).default);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
