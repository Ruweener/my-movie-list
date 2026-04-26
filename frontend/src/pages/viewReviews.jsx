import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { deleteReview, getMovieById } from "../services/api";

function ViewReviews() {
    const [movieReviews, setMovieReviews] = useState([]);
    const [movies, setMovies] = useState([]);

    const fetchReviews = async () => {
        const reviewsRes = await fetch('/api/reviews', { cache: 'no-store' });
        const reviews = await reviewsRes.json();
        setMovieReviews(reviews);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

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

    const handleDeleteReview = async (movieId) => {
        const result = await deleteReview(movieId);

        if (result.success) {
            await fetchReviews();
        } else {
            alert(`Failed to delete review: ${result.error}`);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center bg-gray-800 text-white">
            <NavBar />

            <select className="mt-24 p-2 w-1/3 bg-gray-700 rounded ">
                <option value="most_recent">Most Recent</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="lowest_rated">Lowest Rated</option>
            </select>

            <div className="flex flex-wrap justify-center items-start gap-6 w-full px-4 m-5 overflow-y-auto flex-1">
                { movies && movies.length > 0 ? movies.map((movie, idx) => {
                    const review = movieReviews.find(review => review.movieId === movie.id);
                    return (
                        <div
                            key={ movie.id || idx }
                            className="group relative bg-gray-700 m-2 p-2 rounded-md w-60 transform transition-transform duration-200 hover:scale-105"
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
                                        <p className="text-sm uppercase tracking-wide text-gray-300">Review</p>
                                        <p className="font-semibold text-white">{review.header}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteReview(movie.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Delete Review
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                }) : <p className="text-white mt-4">No reviews available.</p> }
            </div>
        </div>
    )
}

export default ViewReviews;