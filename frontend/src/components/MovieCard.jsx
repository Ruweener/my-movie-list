import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToWatchlist } from '../services/api';

function MovieCard({ movie, rating = -1, isInWatchlist = false, showWatchActions = false, hasReview = false, onWatchlistDelete, onMarkAsWatched, onInfoClick, addedDate }) {
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

    const handleInfoClick = (e) => {
        e.stopPropagation();
        if (onInfoClick) {
            onInfoClick(movie);
        }
    };

    return (
        <div
            className='relative bg-gradient-to-br from-gray-700 to-gray-800 m-2 p-3 rounded-lg w-60 transform transition-all duration-250 hover:scale-105 hover:shadow-2xl border border-gray-600 overflow-hidden'
            onMouseEnter={ () => setHovered(true) }
            onMouseLeave={ () => setHovered(false) }
        >
            <div className='pb-2'>
                <h2 className='font-bold text-white text-sm leading-snug'>{ movie.title }</h2>
                <p className='text-xs text-gray-400 mt-1'>{ movie.release_date }</p>
                { addedDate && (
                    <p className="text-xs text-gray-500 mt-1">
                        Added {new Date(addedDate).toLocaleDateString()}
                    </p>
                ) }
            </div>
            <img className={ imageClassNames } src={ posterPath } alt={ movie.title } />

            { (hovered && rating == -1) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center gap-3 rounded-lg z-10 backdrop-blur-sm">
                    {onInfoClick && (
                        <button
                            type="button"
                            onClick={handleInfoClick}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition transform hover:scale-105 font-semibold"
                            aria-label={`More info about ${movie.title}`}
                            title="More info"
                        >
                            Info
                        </button>
                    )}

                    {isInWatchlist && showWatchActions ? (
                        <>
                            <button
                                onClick={handleMarkAsWatched}
                                disabled={hasReview}
                                className={`px-4 py-2 text-white text-sm rounded-md transition transform hover:scale-105 font-semibold ${hasReview ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {hasReview ? 'Already Reviewed' : 'Write a Review'}
                            </button>
                            <button
                                onClick={handleDeleteFromWatchlist}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition transform hover:scale-105 font-semibold"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleAddToWatchlist}
                                className="px-4 py-2 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition transform hover:scale-105 font-semibold"
                            >
                                Add to Watchlist
                            </button>
                            <Link to={`/reviews/create/${movie.id}/${encodeURIComponent(movie.title)}`} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition transform hover:scale-105 font-semibold">Write a Review</Link>
                        </>
                    )}
                </div>
            ) }

            { rating != -1 && (
                <div className="absolute bottom-3 right-3 text-white px-3 py-1 rounded-lg bg-gray-900/90 backdrop-blur-sm inline-flex border border-gray-700">
                    <p className='font-bold text-2xl'>{rating}</p>
                    <p className='text-xs ml-1 self-center text-gray-300'> /10</p>
                </div>
            ) }

            { feedback && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-20 border border-gray-600">
                    <p className="text-white text-center text-sm font-medium">{feedback}</p>
                </div>
            ) }
        </div>
    );
}

export default MovieCard;