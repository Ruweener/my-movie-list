import { useEffect, useRef, useState } from "react";
import { getPopularMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const initialSearchLoadRef = useRef(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (initialSearchLoadRef.current) {
      initialSearchLoadRef.current = false;
      return;
    }

    const trimmedQuery = query.trim();
    let isActive = true;
    const searchTimeout = setTimeout(async () => {
      if (!isActive) {
        return;
      }

      if (trimmedQuery.length > 0) {
        const results = await searchMovies(trimmedQuery);
        if (isActive) {
          setMovies(results.results || []);
        }
      } else {
        const movies = await getPopularMovies();
        if (isActive) {
          setMovies(movies.results || []);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(searchTimeout);
    };
  }, [query]);


  const fetchMovies = async () => {
    const movies = await getPopularMovies();
    setMovies(movies.results || []);
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-800">
      <NavBar />
      <img src="/logo.png" alt="Logo" className="w-1/5 h-1/5 " />

      <h1 className="text-white font-bold text-2xl -mt-8 font-serif">FilmNotes</h1>


      <div className="flex w-full justify-center m-1 mt-4">
        <input
          type="text"
          placeholder="Search movies..."
          className="w-1/3 p-2 mb-4 rounded border border-gray-300 text-amber-50"
          value={ query }
          onChange={ (e) => setQuery(e.target.value) }
        />
      </div>

      <div className="flex flex-wrap justify-center items-start gap-6 w-full px-4 pb-6">
        { movies.length > 0
          ? movies.map((movie) => <MovieCard key={ movie.id } movie={ movie } />)
          : null }
      </div>
      <Footer />
    </div>
  );
}

export default App;
