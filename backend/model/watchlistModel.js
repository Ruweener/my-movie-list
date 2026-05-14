import mongoose from "mongoose";
const { Schema } = mongoose;

const watchlistSchema = new Schema({
    userId: { type: String, required: true, index: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String },
    addedAt: { type: Date, default: Date.now }
});

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const WatchlistModel = mongoose.model("WatchlistModel", watchlistSchema);

export default WatchlistModel;
