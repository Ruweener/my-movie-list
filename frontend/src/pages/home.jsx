import { useEffect, useState } from "react";
import { getPopularMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import NavBar from "../components/NavBar";

function App() {

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);


  const fetchMovies = async () => {
    const movies = await getPopularMovies();
    setMovies(movies.results || []);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      const results = await searchMovies(trimmedQuery);
      setMovies(results.results || []);
    } else {
      fetchMovies();
    }
  }

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-gray-800">
      <NavBar />

      <form className="flex w-full justify-center m-1 mt-24" onSubmit={ handleSearch }>
        <input
          type="text"
          placeholder="Search movies..."
          className="w-1/3 p-2 mb-4 rounded border border-gray-300 text-amber-50"
          onChange={ (e) => setQuery(e.target.value) }
        />
        <button
          type="submit"
          className="ml-2 p-2 h-fit bg-blue-900 text-white rounded"
        > Search </button>
      </form>

      <div className="flex flex-wrap justify-center items-start gap-6 w-full px-4 overflow-y-auto flex-1">
        { movies.length > 0
          ? movies.map((movie) => <MovieCard key={ movie.id } movie={ movie } />)
          : null }
      </div>
    </div>
  );
}

export default App;
