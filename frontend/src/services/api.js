import { encode } from "punycode";

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
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}



export { getPopularMovies, searchMovies };
