import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import faviLogo from '../assets/favi.png'; // Import the logo

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [popularMovies, setPopularMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch popular movies on component mount
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);
      setErrorPopular(null);
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const formattedMovies = data.results.map(movie => ({
            imdbID: movie.id,
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
            Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450.png?text=No+Image'
          }));
          setPopularMovies(formattedMovies);
        } else {
          setPopularMovies([]);
          setErrorPopular(data.status_message || 'Could not load popular movies.');
        }
      } catch (err) {
        console.error("Failed to fetch popular movies: ", err);
        setErrorPopular('Failed to fetch popular movies. Check connection or API key.');
        setPopularMovies([]);
      }
      setLoadingPopular(false);
    };

    fetchPopularMovies();
  }, [apiKey]); // Depend on apiKey in case it could change (though unlikely for env var)

  // Function to fetch movies from TMDB API
  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setPopularMovies([]); // Clear popular movies when a search is active
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const formattedMovies = data.results.map(movie => ({
          imdbID: movie.id,
          Title: movie.title,
          Year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
          Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450.png?text=No+Image'
        }));
        setMovies(formattedMovies);
      } else {
        setMovies([]);
        if (response.ok && (!data.results || data.results.length === 0)) {
          setError(null);
        } else {
          setError(data.status_message || 'No movies found or API error.');
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      setError('Failed to fetch movies. Check your connection or API key.');
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, apiKey]); // Add apiKey here too

  // Helper to render a grid of movies (used for both popular and search results)
  const renderMovieGrid = (movieList, listType = 'search') => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
      {movieList.map((movie) => (
        <Link 
          to={`/movie/${movie.imdbID}`} 
          key={`${listType}-${movie.imdbID}`} 
          className="group bg-gray-800 rounded-lg shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 overflow-hidden transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out no-underline flex flex-col"
        >
          <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden">
            <img 
              src={movie.Poster} 
              alt={movie.Title} 
              className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 truncate" title={movie.Title}>
              {movie.Title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-200">
              {movie.Year}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <header className="pt-8 pb-10 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 mb-4">
          <img
            src={faviLogo}
            alt="FlickHunt Logo"
            className="h-12 w-12 md:h-16 md:w-16 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
          />
          <h1 
            className="text-5xl md:text-6xl font-bold tracking-tight 
                       bg-gradient-to-b from-yellow-400 via-yellow-500  to-purple-500 
                       text-transparent bg-clip-text 
                       [text-shadow:_0px_0px_8px_rgba(147,112,219,0.2)]"
          >
            FlickHunt
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-400">
          Explore and discover your next favorite movie.
        </p>
      </header>

      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search for a movie by title..."
          className="w-full p-4 text-md bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 shadow-sm hover:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {searchTerm.trim() !== '' ? (
          // Display Search Results or Search-related messages
          <>
            {loading && (
              <div className="text-center py-10">
                <p className="text-xl text-yellow-400 animate-pulse">Searching for movies...</p>
              </div>
            )}
            {!loading && error && (
              <div className="text-center py-10 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>
                <h3 className="mt-2 text-xl font-medium text-red-300">Search Error</h3>
                <p className="text-md text-red-400 mt-1">{error}</p>
              </div>
            )}
            {!loading && !error && movies.length === 0 && searchTerm.trim() !== '' && (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a9.375 9.375 0 006.346-2.727l4.536 4.536-1.06 1.06-4.536-4.536A9.375 9.375 0 1012 3.375v15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 7.525V6m0 1.525V10.5" /></svg>
                <h3 className="mt-4 text-xl font-medium text-gray-300">No Movies Found</h3>
                <p className="mt-1 text-md text-gray-500">Sorry, we couldn't find any movies matching "{searchTerm}".</p>
              </div>
            )}
            {!loading && !error && movies.length > 0 && renderMovieGrid(movies, 'search')}
          </>
        ) : (
          // Display Popular Movies or Popular-related messages (or initial prompt if popular fails)
          <>
            {loadingPopular && (
              <div className="text-center py-10">
                <p className="text-xl text-yellow-400 animate-pulse">Loading popular movies...</p>
              </div>
            )}
            {!loadingPopular && errorPopular && (
              <div className="text-center py-10 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto">
                 <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>
                <h3 className="mt-2 text-xl font-medium text-red-300">Could Not Load Popular Movies</h3>
                <p className="text-md text-red-400 mt-1">{errorPopular}</p>
                 <p className="mt-4 text-md text-gray-400">You can still try searching for a movie above.</p>
              </div>
            )}
            {!loadingPopular && !errorPopular && popularMovies.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold text-yellow-400 mb-6 text-center sm:text-left [text-shadow:_1px_1px_3px_rgba(147,112,219,0.35)]">
                  Trending Movies
                </h2>
                {renderMovieGrid(popularMovies, 'popular')}
              </section>
            )}
            {/* Fallback: Initial prompt if popular movies are not loading, no error, and no popular movies yet (e.g., API returns empty for some reason) */}
            {!loadingPopular && !errorPopular && popularMovies.length === 0 && (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489" /></svg>
                <h3 className="mt-4 text-xl font-medium text-gray-300">Find Your Flick</h3>
                <p className="mt-1 text-md text-gray-500">Type a movie title in the search bar above to begin, or check back for popular movies.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
