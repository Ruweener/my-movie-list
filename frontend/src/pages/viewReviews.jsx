import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getMovieById } from "../services/api";
import ReviewDetailModal from "../components/ReviewDetailModal";

function ViewReviews() {
    const [movieReviews, setMovieReviews] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [sortBy, setSortBy] = useState('date');

    const fetchReviews = async (sortOption = 'date') => {
        const reviewsRes = await fetch(`/api/reviews?sort=${sortOption}`, { cache: 'no-store' });
        const reviews = await reviewsRes.json();
        setMovieReviews(reviews);
    };

    useEffect(() => {
        fetchReviews(sortBy);
    }, [sortBy]);

    useEffect(() => {
        console.log("movieReviews updated:", movieReviews);
        const movieData = movieReviews.map((review) => getMovieById(review.movieId));

        const fetchAllMoviesById = async () => {
            const moviesData = await Promise.all(movieData);
            setMovies(moviesData);
        };

        fetchAllMoviesById();
    }, [movieReviews]);

    useEffect(() => {
        console.log("movies updated:", movies);
    }, [movies]);

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
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-800 text-white">
            <NavBar />

            <select 
                className="mt-6 p-2 w-1/3 bg-gray-700 rounded "
                value={sortBy}
                onChange={handleSortChange}
            >
                <option value="date">Most Recent</option>
                <option value="rating_high">Highest Rated</option>
                <option value="rating_low">Lowest Rated</option>
            </select>

            <div className="flex flex-wrap justify-center items-start gap-6 w-full px-4 m-5 overflow-y-auto flex-1">
                { movies && movies.length > 0 ? movies.map((movie, idx) => {
                    const review = movieReviews.find(review => review.movieId === movie.id);
                    return (
                        <div
                            key={ movie.id || idx }
                            className="group relative bg-gray-700 m-2 p-2 rounded-md w-60 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                            onClick={() => review && handleOpenReview(review, movie)}
                        >
                            <h2 className='font-bold text-white'>{ movie.title }</h2>
                            <p className='text-sm text-white'>{ movie.release_date }</p>
                            <img className='w-full mt-2 rounded-md' src={ movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg" } alt={ movie.title } />

                            <div className="absolute bottom-2 right-2 text-white px-2 py-1 rounded size-fit bg-gray-700 inline-flex">
                                <p className='font-bold text-3xl'>{review ? review.rating : "-"}</p>
                                <p className='inline ml-1'> /10</p>
                            </div>

                            {review && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 rounded-md z-10">
                                    <div className="text-center px-3">
                                        <p className="text-sm uppercase tracking-wide text-gray-300">Click for full review</p>
                                        <p className="font-semibold text-white">{review.header}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }) : <p className="text-white mt-4">No reviews available.</p> }
            </div>

            <ReviewDetailModal
                review={selectedReview}
                movie={selectedMovie}
                isOpen={selectedReview !== null}
                onClose={handleCloseModal}
                onReviewDeleted={handleReviewDeleted}
            />
            <Footer />
        </div>
    )
}

export default ViewReviews;