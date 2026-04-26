import Watchlist from "../model/watchlistModel.js";

const handleGetWatchlist = async (req, res) => {
	try {
		const watchlist = await Watchlist.find().sort({ addedAt: -1 });
		res.json(watchlist);
		console.log("Watchlist fetched:", watchlist);
	} catch (error) {
		console.error("Error fetching watchlist:", error);
		res.status(500).json({ error: "Failed to fetch watchlist" });
	}
};

const handleAddToWatchlist = async (req, res) => {
	const { movieId, title, poster_path } = req.body;

	if (!movieId || !title) {
		return res.status(400).json({ error: "movieId and title are required" });
	}

	try {
		// Check if already exists
		const existing = await Watchlist.findOne({ movieId });
		if (existing) {
			return res.status(409).json({ error: "Movie already in watchlist", movie: existing });
		}

		const newWatchlistItem = new Watchlist({
			movieId,
			title,
			poster_path,
		});

		const savedItem = await newWatchlistItem.save();
		console.log("Added to watchlist:", savedItem);
		res.status(201).json(savedItem);
	} catch (error) {
		console.error("Error adding to watchlist:", error);
		res.status(500).json({ error: "Failed to add to watchlist" });
	}
};

const handleRemoveFromWatchlist = async (req, res) => {
	const { movieId } = req.params;

	try {
		const deletedItem = await Watchlist.deleteOne({ movieId: parseInt(movieId) });
		if (deletedItem.deletedCount === 0) {
			return res.status(404).json({ error: "Movie not found in watchlist" });
		}
		console.log("Removed from watchlist, movieId:", movieId);
		res.json({ message: "Removed from watchlist" });
	} catch (error) {
		console.error("Error removing from watchlist:", error);
		res.status(500).json({ error: "Failed to remove from watchlist" });
	}
};

export { handleGetWatchlist, handleAddToWatchlist, handleRemoveFromWatchlist };
