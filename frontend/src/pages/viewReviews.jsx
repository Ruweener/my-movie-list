import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getAllReviews, getMovieById } from "../services/api";
import ReviewDetailModal from "../components/ReviewDetailModal";

const SORT_OPTIONS = [
    { value: "date", label: "Most Recent" },
    { value: "rating_high", label: "Highest Rated" },
    { value: "rating_low", label: "Lowest Rated" },
];

function ViewReviews() {
    const [movieReviews, setMovieReviews] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [sortBy, setSortBy] = useState("date");

    const fetchReviews = async (sortOption = "date") => {
        const reviews = await getAllReviews(sortOption);
        setMovieReviews(reviews);
    };

    useEffect(() => {
        fetchReviews(sortBy);
    }, [sortBy]);

    useEffect(() => {
        const movieData = movieReviews.map((review) => getMovieById(review.movieId));

        const fetchAllMoviesById = async () => {
            const moviesData = await Promise.all(movieData);
            setMovies(moviesData);
        };

        fetchAllMoviesById();
    }, [movieReviews]);

    const handleOpenReview = (review, movie) => {
        setSelectedReview(review);
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedReview(null);
        setSelectedMovie(null);
    };

    const handleReviewDeleted = async () => {
        await fetchReviews(sortBy);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
            <NavBar />

            <main className="w-full max-w-7xl mx-auto px-4 py-6 flex-1">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
                    <p className="text-gray-400 text-sm">Your movie reviews, kept simple and easy to browse. Click to see the full review.</p>
                </div>

                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`genre-pill ${sortBy === option.value ? 'genre-pill--active' : 'genre-pill--inactive'}`}
                                onClick={() => setSortBy(option.value)}
                                aria-pressed={sortBy === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-start gap-6 w-full">
                    {movies && movies.length > 0 ? (
                        movies.map((movie, idx) => {
                            const review = movieReviews.find((item) => item.movieId === movie.id);
                            return (
                                <div
                                    key={movie.id || idx}
                                    className="group relative bg-gradient-to-br from-gray-700 to-gray-800 m-2 p-3 rounded-lg w-60 transform transition-all duration-250 hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-600 overflow-hidden"
                                    onClick={() => review && handleOpenReview(review, movie)}
                                >
                                    <div className='pb-2'>
                                        <h2 className="font-bold text-white text-sm leading-snug">{movie.title}</h2>
                                        <p className="text-xs text-gray-400 mt-1">{movie.release_date}</p>
                                    </div>
                                    <img
                                        className="w-full rounded-lg"
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg"}
                                        alt={movie.title}
                                    />

                                    <div className="absolute bottom-3 right-3 text-white px-3 py-1 rounded-lg bg-gray-900/90 backdrop-blur-sm inline-flex border border-gray-700">
                                        <p className="font-bold text-2xl">{review ? review.rating : "-"}</p>
                                        <p className="text-xs ml-1 self-center text-gray-300"> /10</p>
                                    </div>

                                    {review && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 rounded-lg z-10 backdrop-blur-sm">
                                            <div className="text-center px-3">
                                                <p className="text-sm uppercase tracking-wide text-gray-300">Click for full review</p>
                                                <p className="font-semibold text-white">{review.header}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-white mt-4">No reviews available.</p>
                    )}
                </div>
            </main>

            <ReviewDetailModal
                review={selectedReview}
                movie={selectedMovie}
                isOpen={selectedReview !== null}
                onClose={handleCloseModal}
                onReviewDeleted={handleReviewDeleted}
            />
            <Footer />
        </div>
    );
}

export default ViewReviews;
