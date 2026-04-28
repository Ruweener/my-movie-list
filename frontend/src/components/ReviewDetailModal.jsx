import { useNavigate } from 'react-router-dom';
import { deleteReview } from '../services/api';
import { useState } from 'react';

function ReviewDetailModal({ review, movie, isOpen, onClose, onReviewDeleted }) {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    if (!isOpen || !review || !movie) return null;

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 8) return 'bg-green-600';
        if (rating >= 6) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    const handleEdit = () => {
        navigate(`/reviews/create/${review.movieId}/${encodeURIComponent(movie.title)}`, {
            state: { review, movie }
        });
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const result = await deleteReview(review.movieId);

            if (result.success) {
                onReviewDeleted();
                onClose();
            } else {
                setDeleteError(result.error || 'Failed to delete review');
            }
        } catch (error) {
            setDeleteError('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : "https://fireteller.com.au/wp-content/uploads/2020/09/Poster_Not_Available2.jpg";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-end p-4 border-b border-gray-600">
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex gap-6 mb-6">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={posterPath}
                                alt={movie.title}
                                className="w-40 h-auto rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Review Details */}
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                            <p className="text-sm text-gray-300 mb-4">Released: {movie.release_date}</p>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-white mb-2">{review.header}</h3>

                                {/* Rating Badge */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getRatingColor(review.rating)} text-white font-bold mb-4`}>
                                    <span className="text-xl">{review.rating}</span>
                                    <span className="text-sm">/10</span>
                                </div>
                            </div>

                            {/* Timestamp */}
                            <p className="text-xs text-gray-400 mb-4">
                                {formatDate(review.timestamp)}
                            </p>

                            {/* Review Text */}
                            <p className="text-gray-100 leading-relaxed text-sm mb-6">
                                {review.reviewText || 'No review text provided.'}
                            </p>

                            {/* Error Message */}
                            {deleteError && (
                                <div className="mb-4 p-3 bg-red-600 text-white rounded text-sm">
                                    Error: {deleteError}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Edit Review
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 rounded text-white transition ${
                                        isDeleting
                                            ? 'bg-red-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewDetailModal;
