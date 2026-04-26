import express from "express";
const router = express.Router();
import {
	handleCreateReview,
	handleGetAllReviews,
	handleDeleteReview,
} from "../../controllers/reviewMovieController.js";

router.route("/")
    .post(handleCreateReview)
    .get(handleGetAllReviews);

router.delete("/:id", handleDeleteReview);

export default router;
