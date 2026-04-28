import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToWatchlist } from '../services/api';

function MovieCard({ movie, rating = -1, isInWatchlist = false, showWatchActions = false, hasReview = false, onWatchlistDelete, onMarkAsWatched }) {
    const [hovered, setHovered] = useState(false);
    const [feedback, setFeedback] = useState('');

    const posterPath = movie.poster_path === null || movie.poster_path === undefined
        ? "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg"
        : `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const imageClassNames = hovered && rating == -1 ? 'w-full mt-2 rounded-md blur-sm' : 'w-full mt-2 rounded-md';

    const handleAddToWatchlist = async () => {
        const result = await addToWatchlist(movie.id, movie.title, movie.poster_path);
        if (result.success) {
            if (result.alreadyExists) {
                setFeedback('Already in watchlist');
            } else {
                setFeedback('Added to watchlist!');
            }
            setTimeout(() => setFeedback(''), 2000);
        } else {
            setFeedback('Error adding to watchlist');
            setTimeout(() => setFeedback(''), 2000);
        }
    };

    const handleDeleteFromWatchlist = async (e) => {
        e.stopPropagation();
        if (onWatchlistDelete) {
            await onWatchlistDelete(movie.id);
        }
    };

    const handleMarkAsWatched = (e) => {
        e.stopPropagation();
        if (hasReview) {
            return;
        }
        if (onMarkAsWatched) {
            onMarkAsWatched(movie.id, movie.title);
        }
    };

    return (
        <div
            className='relative bg-gray-700 m-2 p-2 rounded-md w-60 transform transition-transform duration-200 hover:scale-105'
            onMouseEnter={ () => setHovered(true) }
            onMouseLeave={ () => setHovered(false) }
        >
            <h2 className='font-bold text-white'>{ movie.title }</h2>
            <p className='text-sm text-white'>{ movie.release_date }</p>
            <img className={ imageClassNames } src={ posterPath } alt={ movie.title } />

            { (hovered && rating == -1) && (
                <div className="absolute inset-0 bg-opacity-60 flex flex-col items-center justify-center gap-2 rounded-md z-10">
                    {isInWatchlist && showWatchActions ? (
                        <>
                            <button
                                onClick={handleMarkAsWatched}
                                disabled={hasReview}
                                className={`px-3 py-1 text-white rounded transition ${hasReview ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {hasReview ? 'Already Reviewed' : 'Write a Review'}
                            </button>
                            <button
                                onClick={handleDeleteFromWatchlist}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleAddToWatchlist}
                                className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                            >
                                Add to Watchlist
                            </button>
                            <Link to={`/reviews/create/${movie.id}/${encodeURIComponent(movie.title)}`} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">Write a Review</Link>
                        </>
                    )}
                </div>
            ) }

            { rating != -1 && (
                <div className="absolute bottom-2 right-2 text-white px-2 py-1 rounded size-fit bg-gray-700 inline-flex">
                    <p className='font-bold text-3xl'>{rating}</p>
                    <p className='inline ml-1'> /10</p>
                </div>
            ) }

            { feedback && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-md z-20">
                    <p className="text-white text-center text-sm">{feedback}</p>
                </div>
            ) }
        </div>
    );
}

export default MovieCard;