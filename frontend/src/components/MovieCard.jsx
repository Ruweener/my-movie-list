import { useState } from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie, rating = -1 }) {
    const [hovered, setHovered] = useState(false);

    const posterPath = movie.poster_path === null ? "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg" : `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const imageClassNames = hovered && rating == -1 ? 'w-full mt-2 rounded-md blur-sm' : 'w-full mt-2 rounded-md';


    return (
        <div
            className='relative bg-gray-700 m-2 p-2 rounded-md w-60 transform transition-transform duration-200 hover:scale-105'
            onMouseEnter={ () => setHovered(true) }
            onMouseLeave={ () => setHovered(false) }
        >
            <h2 className='font-bold text-white'>{ movie.title }</h2>
            <p className='text-sm text-white'>Release Date: { movie.release_date }</p>
            <p className='text-sm text-white'>Outsider Rating: { movie.vote_average }</p>
            <img className={ imageClassNames } src={ posterPath } alt={ movie.title } />
            { (hovered && rating == -1) && (
                <div className="absolute inset-0 bg-opacity-60 flex flex-col items-center justify-center gap-2 rounded-md z-10">
                    <Link to={`/watchlist/${movie.id}`} className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition">Add to Watchlist</Link>
                    <Link to={`/reviews/create/${movie.id}/${encodeURIComponent(movie.title)}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Create Review</Link>
                </div>
            ) }
        </div>
    );
}

export default MovieCard;