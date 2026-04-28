import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getAllReviews, getWatchlist, removeFromWatchlist } from "../services/api";

function Watchlist() {
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [reviewedMovieIds, setReviewedMovieIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            const [items, reviews] = await Promise.all([getWatchlist(), getAllReviews()]);

            if (items) {
                setWatchlistItems(items);
            }

            if (Array.isArray(reviews)) {
                setReviewedMovieIds(new Set(reviews.map((review) => review.movieId)));
            }

            setLoading(false);
        };

        fetchWatchlist();
    }, []);

    const handleRemove = async (movieId) => {
        const result = await removeFromWatchlist(movieId);
        if (result.success) {
            setWatchlistItems(watchlistItems.filter(item => item.movieId !== movieId));
        } else {
            alert('Failed to remove from watchlist: ' + result.error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center bg-gray-800 text-white">
            <NavBar />

            <div className="mt-24 w-full flex flex-col items-center flex-1 overflow-y-auto px-4">
                <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : watchlistItems && watchlistItems.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-start gap-6 w-full pb-10">
                        {watchlistItems.map((item) => {
                            const movie = {
                                id: item.movieId,
                                title: item.title,
                                poster_path: item.poster_path,
                                release_date: item.release_date || ""
                            };

                            const hasReview = reviewedMovieIds.has(item.movieId);

                            return (
                                <div key={item.movieId} className="flex flex-col items-center">
                                    <MovieCard
                                        movie={movie}
                                        rating={-1}
                                        isInWatchlist={true}
                                        showWatchActions={true}
                                        hasReview={hasReview}
                                        onMarkAsWatched={() => {
                                            if (!hasReview) {
                                                navigate(`/reviews/create/${item.movieId}/${encodeURIComponent(item.title)}`);
                                            }
                                        }}
                                        onWatchlistDelete={handleRemove}
                                    />
                                    <p className="text-xs text-gray-300 mt-2">
                                        Added: {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white mt-4">Your watchlist is empty. Add some movies!</p>
                )}
            </div>
        </div>
    );
}

export default Watchlist;
