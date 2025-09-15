import { time } from "console";
import mongoose from "mongoose";
const { Schema } = mongoose;

const movieReviewSchema = new Schema({
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    header: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10},
    reviewText: { type: String},
    timestamp: { type: Date, default: Date.now }
});

const MovieReviewModel = mongoose.model("MovieReviewModel", movieReviewSchema);

export default MovieReviewModel;