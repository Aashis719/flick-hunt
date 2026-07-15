import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Eye, EyeOff, Play, X, ExternalLink } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import Carousel from '../components/Carousel';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';

const MovieDetail = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [imdbId, setImdbId] = useState(null);
  const [imdbRating, setImdbRating] = useState(null);
  const [imdbVotes, setImdbVotes] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleWatched, isWatched } = useWatched();

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, videosRes, similarRes, extRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,release_dates`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${apiKey}`)
        ]);

        const data = await detailRes.json();
        
        if (data.success === false) {
          setError(data.status_message || 'Movie not found by ID.');
          setMovie(null);
        } else {
          setMovie(data);
          document.title = `${data.title} – FlickHunt`;
        }

        // Get Trailer
        const videosData = await videosRes.json();
        const trailer = videosData.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }

        // Get Similar
        const similarData = await similarRes.json();
        setSimilarMovies(similarData.results?.slice(0, 10) || []);

        // Get External IDs
        const extData = await extRes.json();
        setImdbId(extData.imdb_id || null);

        if (extData.imdb_id) {
          try {
            const omdbRes = await fetch(`https://www.omdbapi.com/?i=${extData.imdb_id}&apikey=trilogy`);
            const omdbData = await omdbRes.json();
            if (omdbData.Response === "True") {
              setImdbRating(omdbData.imdbRating !== "N/A" ? omdbData.imdbRating : null);
              setImdbVotes(omdbData.imdbVotes !== "N/A" ? omdbData.imdbVotes : null);
            }
          } catch (e) {
            console.error("OMDb fetch failed:", e);
          }
        }

      } catch (err) {
        console.error("API call failed:", err);
        setError('Failed to fetch movie details. Please try again later.');
        setMovie(null);
      }
      setLoading(false);
    };

    if (id) fetchMovieDetail();
    
    // Scroll to top when ID changes
    window.scrollTo(0, 0);

  }, [id, apiKey]);

  if (loading) return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden md:flex relative">
        {/* Poster Section */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 relative">
          <div className="aspect-[2/3] w-full bg-gray-700"></div>
          
          <div className="absolute top-4 right-4 md:static md:p-4 flex md:flex-row flex-col gap-3 justify-center items-center">
            <div className="h-[42px] bg-gray-700 rounded-lg w-full"></div>
            <div className="h-[42px] bg-gray-700 rounded-lg w-full"></div>
          </div>
        </div>
        
        {/* Detail Section */}
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          {/* Title Area */}
          <div className="h-10 bg-gray-700 rounded w-3/4 mb-2"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 bg-gray-700 rounded w-12"></div>
            <div className="h-5 bg-gray-700 rounded w-16"></div>
            <div className="h-5 bg-gray-700 rounded w-40"></div>
          </div>
          
          {/* Action Row */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="h-[44px] bg-gray-700 rounded-lg w-[160px]"></div>
            <div className="h-[44px] bg-gray-700 rounded-lg w-[100px]"></div>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-700 rounded w-full"></div>
              <div className="h-5 bg-gray-700 rounded w-[95%]"></div>
              <div className="h-5 bg-gray-700 rounded w-[85%]"></div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            <div>
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 opacity-60"></div>
              <div className="h-6 bg-gray-700 rounded w-48"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 opacity-60"></div>
              <div className="h-6 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 opacity-60"></div>
              <div className="h-6 bg-gray-700 rounded w-32"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 opacity-60"></div>
              <div className="h-6 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !movie) {
    return (
      <div className="container mx-auto p-4 text-center text-xl py-10 min-h-screen">
        <p className="text-red-400 mb-4">{error || "Movie not found."}</p>
        <Link to="/" className="inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  let mpaaRating = 'N/A';
  const usRelease = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
  if (usRelease && usRelease.release_dates.length > 0) {
    const cert = usRelease.release_dates.find(d => d.certification);
    if (cert) mpaaRating = cert.certification;
  }

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/400x600.png?text=No+Image';

  const isFav = isFavorite(movie.id);
  const isWatch = isWatched(movie.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white"
    >
      <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden md:flex relative">
        {/* Poster Section */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 relative">
          <img src={poster} alt={movie.title} className="w-full h-auto object-cover" />
          
          {/* Action Buttons below poster */}
          <div className="absolute top-4 right-4 md:static md:p-4 flex md:flex-row flex-col gap-3 justify-center items-center md:bg-gray-850">
             <button 
                onClick={() => toggleFavorite(movie)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-md w-full justify-center cursor-pointer ${
                  isFav ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
             >
               {isFav ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
               <span className="hidden md:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
             </button>
             
             <button 
                onClick={() => toggleWatched(movie)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-md w-full justify-center cursor-pointer ${
                  isWatch ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
             >
               {isWatch ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               <span className="hidden md:inline">{isWatch ? 'Watched' : 'Watch'}</span>
             </button>
          </div>
        </div>
        
        {/* Detail Section */}
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            {movie.title} <span className="text-2xl text-gray-400 font-normal">({year})</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-6">
            {mpaaRating !== 'N/A' && (
              <span className="border border-gray-500 px-2 py-0.5 rounded text-gray-400">{mpaaRating}</span>
            )}
            {movie.runtime > 0 && <span>{movie.runtime} min</span>}
            <span>&bull;</span>
            <span>{movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
          </div>
          
          {/* Action Row: Trailer & IMDB */}
          <div className="flex flex-wrap gap-4 mb-8">
            {trailerKey && (
              <button 
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Trailer
              </button>
            )}
            {imdbId && (
              <a 
                href={`https://www.imdb.com/title/${imdbId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#f5c518] hover:bg-[#e2b616] text-black px-5 py-2.5 rounded-lg font-bold transition-colors shadow-lg"
              >
                IMDb <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-3 border-b border-gray-700 pb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-auto">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Director</h3>
              <p className="text-lg text-white">{director ? director.name : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Top Cast</h3>
              <p className="text-lg text-white">{movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">IMDb Rating</h3>
              <div className="flex items-center gap-2 text-lg text-white">
                <span className="text-yellow-400 font-bold">{imdbRating || movie.vote_average?.toFixed(1)}/10</span>
                <span className="text-gray-500 text-sm">({imdbVotes || movie.vote_count?.toLocaleString()} votes)</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Release Date</h3>
              <p className="text-lg text-white">{movie.release_date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="mt-12">
          <Carousel title="You Might Also Like">
            {similarMovies.map(similar => (
              <div key={similar.id} className="w-[200px] shrink-0 snap-start">
                <MovieCard movie={similar} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setShowTrailer(false)}
          >
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                title="YouTube video player" 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default MovieDetail;
