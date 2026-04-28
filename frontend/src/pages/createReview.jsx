import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createOrUpdateReview } from "../services/api.js";

function CreateReview() {
    const { id, title } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        header: '',
        rating: '',
        reviewText: ''
    });

    useEffect(() => {
        // If editing, pre-populate the form with existing review data
        if (location.state?.review) {
            const review = location.state.review;
            setFormData({
                header: review.header || '',
                rating: review.rating || '',
                reviewText: review.reviewText || ''
            });
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        try {
            const result = await createOrUpdateReview(
                parseInt(id),
                title,
                formData.header,
                parseFloat(formData.rating),
                formData.reviewText
            );

            if (result.success) {
                setSuccess(true);
                const messageType = result.isCreated ? "created" : "updated";
                console.log(`Review ${messageType} successfully`);
                setTimeout(() => navigate("/reviews"), 1500);
            } else {
                setError(result.error || "Failed to save review");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
            <form className="bg-gray-700 p-6 rounded-md shadow-md w-1/2" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Create/Update Review for "{decodeURIComponent(title)}"</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-600 text-white rounded">
                        Error: {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-600 text-white rounded">
                        Review saved successfully! Redirecting...
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2">Header <span className="text-red-400">*</span></label>
                    <input 
                        type="text" 
                        name="header"
                        value={formData.header}
                        onChange={handleInputChange}
                        required 
                        className="w-full p-2 rounded border border-gray-300 text-gray-300" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Rating (1-10): <span className="text-red-400">*</span></label>
                    <input 
                        type="number" 
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="1" 
                        max="10" 
                        required 
                        className="w-full p-2 rounded border border-gray-300 text-gray-300" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Review:</label>
                    <textarea 
                        name="reviewText"
                        value={formData.reviewText}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded border border-gray-300 text-gray-300" 
                        rows="5"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded`}
                >
                    {isLoading ? "Saving..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}

export default CreateReview;