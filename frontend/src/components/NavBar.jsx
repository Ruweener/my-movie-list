import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div className="absolute top-0 left-0 w-full h-16 bg-gray-900 flex items-center justify-between px-4 z-50">
            <Link to="/" className="text-white font-bold text-xl cursor-pointer m-2">Movie Reviewer</Link>
            <Link to="/Reviews" className="text-white font-bold text-xl cursor-pointer border-amber-200 m-2">Reviews</Link>
        </div>
    )
}

export default NavBar;