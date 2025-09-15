import express from "express";
const router = express.Router();
import {
	handleCreateReview,
	handleGetAllReviews,
} from "../../controllers/reviewMovieController.js";

router.route("/")
    .post(handleCreateReview)
    .get(handleGetAllReviews);

export default router;
