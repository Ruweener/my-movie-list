import express from "express";
const router = express.Router();
import {
	handleGetWatchlist,
	handleAddToWatchlist,
	handleRemoveFromWatchlist,
} from "../../controllers/watchlistController.js";

router.route("/")
	.get(handleGetWatchlist)
	.post(handleAddToWatchlist);

router.route("/:movieId")
	.delete(handleRemoveFromWatchlist);

export default router;
