import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Eye, EyeOff, Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useWatched } from '../hooks/useWatched';
import faviLogo from '../assets/favi.png';

export default function MovieCard({ movie, listType = 'default' }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleWatched, isWatched } = useWatched();

  const isFav = isFavorite(movie.imdbID || movie.id);
  const isWatch = isWatched(movie.imdbID || movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleWatchedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatched(movie);
  };

  // Movie mapping supports both TMDB raw and the previous mapped structure
  const id = movie.imdbID || movie.id;
  const title = movie.title || movie.Title;
  const year = movie.Year || (movie.release_date ? movie.release_date.substring(0, 4) : 'N/A');
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : (movie.Poster !== 'N/A' && movie.Poster ? movie.Poster : null);
  const voteAverage = movie.voteAverage || movie.vote_average;
  const [imdbRating, setImdbRating] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchImdbRating = async () => {
      try {
        let externalId = movie.imdbID;
        if (!externalId) {
          const apiKey = import.meta.env.VITE_TMDB_API_KEY;
          const extRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${apiKey}`);
          const extData = await extRes.json();
          externalId = extData.imdb_id;
        }
        
        if (externalId && isMounted) {
          const omdbRes = await fetch(`https://www.omdbapi.com/?i=${externalId}&apikey=trilogy`);
          const omdbData = await omdbRes.json();
          if (omdbData.Response === "True" && omdbData.imdbRating !== "N/A" && isMounted) {
            setImdbRating(omdbData.imdbRating);
          }
        }
      } catch (err) {
        // fail gracefully
      }
    };
    
    if (movie.id || movie.imdbID) fetchImdbRating();
    return () => { isMounted = false; };
  }, [movie.id, movie.imdbID]);

  const displayRating = imdbRating || (voteAverage > 0 ? Number(voteAverage).toFixed(1) : null);

  const releaseDate = movie.release_date || movie.Year;
  const today = new Date().toISOString().split('T')[0];
  const isUpcoming = releaseDate && releaseDate > today;

  return (
    <Link 
      to={`/movie/${id}`} 
      className="group bg-gray-800 rounded-lg shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 overflow-hidden transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out no-underline flex flex-col relative"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative bg-gray-900 flex items-center justify-center">
        {poster ? (
          <img 
            src={poster} 
            alt={title} 
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <img src={faviLogo} alt="Logo" className="w-16 h-16 opacity-50 mb-2 grayscale" />
            <span className="text-gray-500 text-sm text-center">{title}</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {displayRating && (
          <div className="absolute bottom-2 right-2 bg-gray-900/80 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg border border-gray-700/50" title="IMDb Rating">
            <Star className="w-3 h-3 mr-1 fill-yellow-400" />
            {displayRating}
          </div>
        )}

        {/* Watched Badge (bottom left) */}
        {isWatch && (
          <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold p-1 rounded-full flex items-center shadow-lg border border-green-400/50">
             <BookmarkCheck className="w-4 h-4" />
          </div>
        )}

        {/* Action Buttons (top right) - visible on hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onClick={handleFavoriteClick}
            className="p-1.5 sm:p-2 rounded-full bg-gray-900/60 hover:bg-gray-900/90 backdrop-blur-sm transition-colors text-white hover:text-yellow-400 shadow-md border border-gray-700/50 group/btn cursor-pointer"
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFav ? (
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          
          {!isUpcoming && (
            <button 
              onClick={handleWatchedClick}
              className="p-1.5 sm:p-2 rounded-full bg-gray-900/60 hover:bg-gray-900/90 backdrop-blur-sm transition-colors text-white hover:text-green-400 shadow-md border border-gray-700/50 group/btn cursor-pointer"
              title={isWatch ? "Mark as Unwatched" : "Mark as Watched"}
            >
              {isWatch ? (
                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-lg font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 truncate" title={title}>
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 group-hover:text-gray-300 transition-colors duration-200">
          {year}
        </p>
      </div>
    </Link>
  );
}
