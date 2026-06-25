import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const Category = () => {
  const { type } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  let endpoint = '';
  let title = '';

  switch (type) {
    case 'trending':
      endpoint = '/trending/movie/day';
      title = 'Trending Today';
      break;
    case 'top_rated':
      endpoint = '/movie/top_rated';
      title = 'Top Rated Movies';
      break;
    case 'upcoming':
      endpoint = '/movie/upcoming';
      title = 'Upcoming Movies';
      break;
    default:
      endpoint = '/trending/movie/day';
      title = 'Movies';
  }

  useEffect(() => {
    document.title = `${title} – FlickHunt`;
    
    const fetchMovies = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      try {
        let results = [];
        if (page === 1) {
          const [res1, res2] = await Promise.all([
            fetch(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=en-US&page=1`),
            fetch(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=en-US&page=2`)
          ]);
          const data1 = await res1.json();
          const data2 = await res2.json();
          results = [...(data1.results || []), ...(data2.results || [])];
        } else {
          // If page > 1, fetch the actual next page (which is page + 1 since 1 and 2 were fetched initially)
          const res = await fetch(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=en-US&page=${page + 1}`);
          const data = await res.json();
          results = data.results || [];
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        if (type === 'upcoming') {
          results = results.filter(movie => movie.release_date > today);
        } else {
          // Exclude future releases from trending and top_rated
          results = results.filter(movie => movie.release_date && movie.release_date <= today);
        }
        
        if (page === 1) {
          setMovies(results);
        } else {
          setMovies(prev => [...prev, ...results]);
        }
      } catch (err) {
        console.error("Failed to fetch category", err);
        setError("Could not load movies.");
      }
      setLoading(false);
      setLoadingMore(false);
    };

    fetchMovies();
  }, [type, endpoint, title, apiKey, page]);

  // Reset page when category changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"
    >
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors font-medium mb-4">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 [text-shadow:_0px_0px_8px_rgba(250,204,21,0.2)]">
          {title}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
          {[...Array(20)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto text-red-400">
          {error}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No movies found.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <div className="text-center mt-12 mb-8">
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={loadingMore}
              className="bg-gray-800 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500 hover:text-gray-900 transition-colors px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Category;
