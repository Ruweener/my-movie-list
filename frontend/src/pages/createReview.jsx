import { useParams } from "react-router-dom";

function CreateReview() {
    const { id, title } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const header = form[0].value;
        const rating = form[1].value;
        const reviewText = form[2].value;
        
        try {
            const response = fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ movieId: parseInt(id), title, header, rating: parseFloat(rating), reviewText })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-800 text-white" onSubmit={ handleSubmit }>
            <form className="bg-gray-700 p-6 rounded-md shadow-md w-1/2">
                <h2 className="text-2xl font-bold mb-4">Create Review for "{ decodeURIComponent(title) }"</h2>
                <div className="mb-4">
                    <label className="block mb-2">Header <span className="text-red-400">*</span></label>
                    <input type="text" required className="w-full p-2 rounded border border-gray-300 text-gray-300" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Rating (1-10): <span className="text-red-400">*</span></label>
                    <input type="number" min="1" max="10" required className="w-full p-2 rounded border border-gray-300 text-gray-300" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Review:</label>
                    <textarea className="w-full p-2 rounded border border-gray-300 text-gray-300" rows="5"></textarea>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
            </form>
        </div>
    )

}

export default CreateReview;