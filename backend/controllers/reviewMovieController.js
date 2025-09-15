import MovieReview from "../model/movieReviewModel.js";

const handleGetAllReviews = async (req, res) => {
	try {
		const reviews = await MovieReview.find();
		res.json(reviews);
		console.log(reviews);
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
		const newReview = new MovieReview({
			movieId,
			title,
			header,
			rating,
			reviewText,
		});

		const savedReview = await newReview.save();
		console.log("Review saved:", savedReview);
		res.status(201).json(savedReview);
	} catch (error) {
		console.error("Error creating review:", error);
		res.status(500).json({ error: "Failed to create review" });
	}
};

export { handleCreateReview, handleGetAllReviews };
