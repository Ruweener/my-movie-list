import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { getAllReviews, getWatchlist, removeFromWatchlist, getMovieById, getMovieProviders } from "../services/api";
import MovieInfoModal from "../components/MovieInfoModal";

function Watchlist() {
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [reviewedMovieIds, setReviewedMovieIds] = useState(new Set());
    const [filterBy, setFilterBy] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedProviders, setSelectedProviders] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isInfoLoading, setIsInfoLoading] = useState(false);
    const navigate = useNavigate();
    const infoRequestRef = useRef(0);

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

    const filteredItems = watchlistItems.filter((item) => {
        const hasReview = reviewedMovieIds.has(item.movieId);

        if (filterBy === "reviewed") {
            return hasReview;
        }

        if (filterBy === "to-review") {
            return !hasReview;
        }

        return true;
    });

    const handleOpenMovieInfo = async (movie) => {
        const requestId = infoRequestRef.current + 1;
        infoRequestRef.current = requestId;

        setIsInfoOpen(true);
        setIsInfoLoading(true);
        setSelectedMovie(movie);
        setSelectedProviders(null);

        try {
            const [movieDetails, providers] = await Promise.all([
                getMovieById(movie.id),
                getMovieProviders(movie.id),
            ]);

            if (infoRequestRef.current !== requestId) {
                return;
            }

            setSelectedMovie({ ...movie, ...movieDetails });
            setSelectedProviders(providers);
        } catch {
            if (infoRequestRef.current !== requestId) {
                return;
            }

            setSelectedMovie(movie);
            setSelectedProviders(null);
        } finally {
            if (infoRequestRef.current === requestId) {
                setIsInfoLoading(false);
            }
        }
    };

    const handleCloseMovieInfo = () => {
        infoRequestRef.current += 1;
        setIsInfoOpen(false);
        setSelectedMovie(null);
        setSelectedProviders(null);
        setIsInfoLoading(false);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white">
            <NavBar />

            <div className="mt-6 w-full max-w-7xl flex flex-col items-center flex-1 px-4 pb-8">
                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
                    <p className="text-gray-400 text-sm">Keep track of movies you want to watch and jump straight into reviews.</p>
                </div>

                <div className="w-full mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "all", label: "All" },
                            { value: "reviewed", label: "Reviewed" },
                            { value: "to-review", label: "To Review" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`genre-pill ${filterBy === option.value ? 'genre-pill--active' : 'genre-pill--inactive'}`}
                                onClick={() => setFilterBy(option.value)}
                                aria-pressed={filterBy === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : filteredItems && filteredItems.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-start gap-6 w-full pb-10">
                        {filteredItems.map((item) => {
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
                                        addedDate={item.addedAt}
                                        onMarkAsWatched={() => {
                                            if (!hasReview) {
                                                navigate(`/reviews/create/${item.movieId}/${encodeURIComponent(item.title)}`);
                                            }
                                        }}
                                        onInfoClick={handleOpenMovieInfo}
                                        onWatchlistDelete={handleRemove}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white mt-4">No movies match this filter.</p>
                )}
            </div>
            <MovieInfoModal
                isOpen={isInfoOpen}
                movie={selectedMovie || { title: '', release_date: '', poster_path: null, overview: '', genres: [] }}
                providers={selectedProviders}
                isLoading={isInfoLoading}
                onClose={handleCloseMovieInfo}
            />
                <Footer />
        </div>
    );
}

export default Watchlist;
