import MovieReview from "../model/movieReviewModel.js";

const handleGetAllReviews = async (req, res) => {
	try {
		const { sort } = req.query;
		let sortOption = {};

		// Apply sorting based on query parameter
		switch (sort) {
			case 'rating_high':
				sortOption = { rating: -1 }; // Highest rated first
				break;
			case 'rating_low':
				sortOption = { rating: 1 }; // Lowest rated first
				break;
			case 'date':
			default:
				sortOption = { timestamp: -1 }; // Most recent first
				break;
		}

		const reviews = await MovieReview.find().sort(sortOption);
		res.json(reviews);
	} catch (error) {
		console.error("Error fetching reviews:", error);
		res.status(500).json({ error: "Failed to fetch reviews" });
	}
};

const handleCreateReview = async (req, res) => {
	const { movieId, title, header, rating, reviewText } = req.body;

	if (!movieId || !rating || !title || !header) {
		return res
			.status(400)
			.json({ error: "movieId, title, rating and header are required" });
	}
	try {
		// Check if review exists before update
		const existingReview = await MovieReview.findOne({ movieId });
		const isNew = !existingReview;
		
		const updatedReview = await MovieReview.findOneAndUpdate(
			{ movieId },
			{
				movieId,
				title,
				header,
				rating,
				reviewText,
				timestamp: new Date(),
			},
			{ upsert: true, new: true }
		);

		const statusCode = isNew ? 201 : 200;
		console.log(`Review ${isNew ? "created" : "updated"}:`, updatedReview);
		res.status(statusCode).json(updatedReview);
	} catch (error) {
		console.error("Error creating/updating review:", error);
		res.status(500).json({ error: "Failed to create or update review" });
	}
};

const handleDeleteReview = async (req, res) => {
	const { id } = req.params;

	try { 
		const deletedReview = await MovieReview.deleteOne({ movieId: parseInt(id) });
		if (deletedReview.deletedCount === 0) {
			return res.status(404).json({ error: "Review not found" });
		}

		res.json({ message: "Review deleted" });
	} catch (error) {
		console.error("Error deleting review:", error);
		res.status(500).json({ error: "Failed to delete review" });
	}
}

export { handleCreateReview, handleGetAllReviews, handleDeleteReview };
