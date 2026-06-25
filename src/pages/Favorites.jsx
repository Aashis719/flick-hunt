import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../hooks/useFavorites';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { favorites } = useFavorites();

  useEffect(() => {
    document.title = "Favorites – FlickHunt";
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"
    >
      <header className="pt-4 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-yellow-400 [text-shadow:_0px_0px_8px_rgba(147,112,219,0.2)]">
          My Favorites
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Your personal collection of must-watch movies.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-300">No favorites yet.</h2>
          <p className="text-gray-500 mt-2 mb-6">Start exploring and save some movies you love.</p>
          <Link to="/" className="inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
          {favorites.map((movie) => (
            <MovieCard key={`fav-${movie.id || movie.imdbID}`} movie={movie} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;
