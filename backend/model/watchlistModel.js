import mongoose from "mongoose";
const { Schema } = mongoose;

const watchlistSchema = new Schema({
    movieId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    poster_path: { type: String },
    addedAt: { type: Date, default: Date.now }
});

const WatchlistModel = mongoose.model("WatchlistModel", watchlistSchema);

export default WatchlistModel;
