import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/api";

function Watchlist() {
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            const items = await getWatchlist();
            if (items) {
                setWatchlistItems(items);
            }
            setLoading(false);
        };

        fetchWatchlist();
    }, []);

    const handleRemove = async (movieId) => {
        const result = await removeFromWatchlist(movieId);
        if (result.success) {
            setWatchlistItems(watchlistItems.filter(item => item.movieId !== movieId));
        } else {
            alert('Failed to remove from watchlist: ' + result.error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center bg-gray-800 text-white">
            <NavBar />

            <div className="mt-24 w-full flex flex-col items-center flex-1 overflow-y-auto px-4">
                <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : watchlistItems && watchlistItems.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-start gap-6 w-full pb-10">
                        {watchlistItems.map((item) => {
                            const posterPath = item.poster_path 
                                ? `https://image.tmdb.org/t/p/original${item.poster_path}` 
                                : "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg";

                            return (
                                <div 
                                    key={item.movieId} 
                                    className="relative bg-gray-700 m-2 p-2 rounded-md w-60 transform transition-transform duration-200 hover:scale-105"
                                >
                                    <h2 className="font-bold text-white">{item.title}</h2>
                                    <img 
                                        className="w-full mt-2 rounded-md" 
                                        src={posterPath} 
                                        alt={item.title} 
                                    />
                                    <p className="text-xs text-gray-300 mt-2">
                                        Added: {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item.movieId)}
                                        className="w-full mt-3 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Remove from Watchlist
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white mt-4">Your watchlist is empty. Add some movies!</p>
                )}
            </div>
        </div>
    );
}

export default Watchlist;
