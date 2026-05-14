import React from 'react';

function MovieInfoModal({ isOpen, movie, providers, isLoading = false, onClose }) {
    if (!isOpen) return null;

    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg";

    const genres = Array.isArray(movie.genres) ? movie.genres : [];

    const renderProviders = (list) => {
        if (!list || !Array.isArray(list) || list.length === 0) return <p className="text-gray-300">Not available</p>;
        return (
            <div className="flex flex-wrap gap-4">
                {list.map((p) => (
                    <div key={p.provider_id} className="flex flex-col items-center w-20 transform hover:scale-110 transition duration-200">
                        {p.logo_path ? (
                            <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-12 h-12 object-contain rounded-lg shadow-md border border-gray-600" />
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs text-white rounded-lg font-semibold border border-gray-600">{p.provider_name}</div>
                        )}
                        <p className="text-xs text-gray-300 text-center mt-2 font-medium">{p.provider_name}</p>
                    </div>
                ))}
            </div>
        );
    };

    const flatrate = providers && providers.flatrate ? providers.flatrate : [];
    const rent = providers && providers.rent ? providers.rent : [];
    const buy = providers && providers.buy ? providers.buy : [];

    const scrollbarStyle = `
        .modal-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.5);
            border-radius: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(107, 114, 128, 0.8);
            border-radius: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 1);
        }
    `;

    return (
        <>
            <style>{scrollbarStyle}</style>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="modal-scrollbar bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-600">
                    <div className="flex justify-end p-4 border-b border-gray-600">
                        <button onClick={onClose} className="text-gray-300 hover:text-white transition text-2xl font-bold hover:scale-110 transform duration-200">✕</button>
                    </div>

                    <div className="p-6">
                        {isLoading && (
                            <div className="mb-4 rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-3 text-sm text-gray-300 font-medium">
                                Loading movie details...
                            </div>
                        )}

                        <div className="flex gap-6 mb-6">
                            <div className="flex-shrink-0">
                                <img src={posterPath} alt={movie.title} className="w-40 h-auto rounded-lg shadow-2xl border border-gray-600" />
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
                                <p className="text-sm text-gray-400 mb-3">Released: {movie.release_date || 'Unknown'}</p>
                                {genres.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {genres.map((genre) => (
                                            <span key={genre.id} className="rounded-full bg-blue-600/70 px-3 py-1 text-xs text-white font-semibold border border-blue-500/50">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-300 mb-4">Genres: Not available</p>
                                )}

                                <div className="text-gray-100 leading-relaxed text-sm mb-6">
                                    {movie.overview || 'No description available.'}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-blue-500 rounded"></span>
                                        Where to Watch
                                    </h3>
                                    <div className="mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Streaming</h4>
                                        {renderProviders(flatrate)}
                                    </div>
                                    <div className="mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Rent</h4>
                                        {renderProviders(rent)}
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Buy</h4>
                                        {renderProviders(buy)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MovieInfoModal;
