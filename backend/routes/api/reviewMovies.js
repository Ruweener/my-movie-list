import express from "express";
const router = express.Router();
import {
	handleCreateReview,
	handleGetAllReviews,
	handleDeleteReview,
} from "../../controllers/reviewMovieController.js";
import requireAuth from "../../middleware/requireAuth.js";

router.use(requireAuth);

router.route("/")
    .post(handleCreateReview)
    .get(handleGetAllReviews);

router.delete("/:id", handleDeleteReview);

export default router;
