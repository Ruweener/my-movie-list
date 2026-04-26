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

const getWatchlist = async () => {
    try {
        const response = await fetch('/api/watchlist');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
    }
}

const addToWatchlist = async (movieId, title, poster_path) => {
    try {
        const response = await fetch('/api/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, title, poster_path }),
        });
        const data = await response.json();
        if (response.status === 409) {
            console.warn('Movie already in watchlist');
            return { success: true, alreadyExists: true };
        }
        if (!response.ok) {
            throw new Error(data.error || 'Failed to add to watchlist');
        }
        return { success: true, alreadyExists: false, data };
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return { success: false, error: error.message };
    }
}

const removeFromWatchlist = async (movieId) => {
    try {
        const response = await fetch(`/api/watchlist/${movieId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove from watchlist');
        }
        return { success: true };
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return { success: false, error: error.message };
    }
}

const createOrUpdateReview = async (movieId, title, header, rating, reviewText) => {
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, title, header, rating, reviewText }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to save review: ${response.statusText}`);
        }
        
        const data = await response.json();
        const isCreated = response.status === 201;
        return { success: true, data, isCreated };
    } catch (error) {
        console.error('Error creating/updating review:', error);
        return { success: false, error: error.message };
    }
}

const deleteReview = async (movieId) => {
    try {
        const response = await fetch(`/api/reviews/${movieId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || 'Failed to delete review');
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting review:', error);
        return { success: false, error: error.message };
    }
}

export { getPopularMovies, searchMovies, getMovieById, getWatchlist, addToWatchlist, removeFromWatchlist, createOrUpdateReview, deleteReview };
