const getPopularMovies = async () => {
    try {
        const response = await fetch('/api/movies/popular');
        const data =  await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

const searchMovies = async (query) => {
    try {
        const response = await fetch(`/api/movies/search?searchquery=${query}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

const getMovieById = async (movieId) =>{
    try {
        const response = await fetch(`/api/movies/${movieId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
    }
}


export { getPopularMovies, searchMovies };
