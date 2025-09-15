import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

function ViewReviews() {
    const [movieReviews, setMovieReviews] = useState([]);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsRes = await fetch('/api/reviews');
            const reviews = await reviewsRes.json();
            setMovieReviews(reviews);
        };

        fetchReviews();
        console.log(movies);
        console.log("movie reviews:", movieReviews);
    }, []);

    const fetchMovieById = async (movieId) => {
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) {
            console.error('Failed to fetch movie:', movieId, response.status);
            return null;
        }
        return await response.json();
    };

    useEffect(() => {
        console.log("movieReviews updated:", movieReviews);
        const movieData = movieReviews.map((review) => fetchMovieById(review.movieId));

        const fetchAllMoviesById = async () => {
            const moviesData = await Promise.all(movieData);
            setMovies(moviesData);
        };

        fetchAllMoviesById();
    }, [movieReviews]);

    useEffect(() => {
        console.log("movies updated:", movies);
    }, [movies]);

    return (
        <div className="w-full h-screen flex flex-col items-center bg-gray-800 text-white">
            <NavBar />

            <select className="mt-24 p-2 w-1/3 bg-gray-700 rounded ">
                <option value="most_recent">Most Recent</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="lowest_rated">Lowest Rated</option>
            </select>

            <div className="flex flex-col items-center w-full px-4 overflow-y-auto flex-1 mt-4">
                { movies && movies.length > 0 ? movies.map(() => { <MovieCard key={ movies.id } movie={ movies } /> }) : <p className="text-white mt-4">No reviews available.</p> }
            </div>


        </div>
    )
}

export default ViewReviews;