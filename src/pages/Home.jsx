import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch movies from TMDB API
  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_TMDB_API_KEY&query=${searchQuery}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Map TMDB data to the structure your component expects (or update component structure)
        const formattedMovies = data.results.map(movie => ({
          imdbID: movie.id, // Using TMDB's id as a unique key
          Title: movie.title,
          Year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A', // Extract year
          Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450.png?text=No+Image'
        }));
        setMovies(formattedMovies);
      } else {
        setMovies([]);
        setError(data.status_message || 'No movies found.');
      }
    } catch (error) {
      console.error("API call failed:", error);
      setError('Failed to fetch movies. Please try again later.');
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500); // Debounce API call by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-yellow-400">FlickHunt</h1>
        <p className="text-gray-400 text-lg">Explore and discover your next favorite movie.</p>
      </header>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      
      {!loading && !error && movies.length === 0 && searchTerm.trim() !== '' && (
        <p className="text-center text-gray-500">No movies found for "{searchTerm}". Try a different search term.</p>
      )}

      {!loading && !error && movies.length === 0 && searchTerm.trim() === '' && (
        <p className="text-center text-gray-500">Type something in the search bar to find movies.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          // Link to the movie detail page using the movie's TMDB ID
          <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out no-underline">
            <img src={movie.Poster} alt={movie.Title} className="w-full h-auto object-cover" style={{aspectRatio: "2/3"}} />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-yellow-400 truncate" title={movie.Title}>{movie.Title}</h3>
              <p className="text-sm text-gray-400">{movie.Year}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
