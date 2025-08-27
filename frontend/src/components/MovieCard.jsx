
function MovieCard({movie}) {
    return (
        <div className='bg-gray-700 m-2 p-2 rounded-md w-60'>
            <h2 className='font-bold text-white'>{movie.title}</h2>
            <p className='text-sm text-white'>Release Date: {movie.release_date}</p>
            <p className='text-sm text-white'>Outsider Rating: {movie.vote_average}</p>
            <img className='w-full mt-2 rounded-md' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
        </div>
    );
}

export default MovieCard;