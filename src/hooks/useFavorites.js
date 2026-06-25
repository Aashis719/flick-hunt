import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const item = window.localStorage.getItem('flickhunt_favorites');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn("Error reading localStorage for favorites", error);
      return [];
    }
  });

  useEffect(() => {
    const syncFavorites = () => {
      try {
        const item = window.localStorage.getItem('flickhunt_favorites');
        setFavorites(item ? JSON.parse(item) : []);
      } catch (e) {
        console.error(e);
      }
    };
    
    window.addEventListener('favoritesUpdated', syncFavorites);
    window.addEventListener('storage', syncFavorites); // Cross-tab sync
    
    return () => {
      window.removeEventListener('favoritesUpdated', syncFavorites);
      window.removeEventListener('storage', syncFavorites);
    };
  }, []);

  const toggleFavorite = (movie) => {
    // Read the absolute latest state from storage to avoid race conditions 
    // when multiple MovieCard components trigger clicks quickly
    const currentFavorites = JSON.parse(window.localStorage.getItem('flickhunt_favorites') || '[]');
    
    const isFav = currentFavorites.some(fav => 
      (movie.id && fav.id === movie.id) || 
      (movie.imdbID && fav.imdbID === movie.imdbID)
    );
    
    let nextFavorites;
    if (isFav) {
      toast('Removed from Favorites', {
        icon: '🗑️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      nextFavorites = currentFavorites.filter(fav => 
        !(movie.id && fav.id === movie.id) && 
        !(movie.imdbID && fav.imdbID === movie.imdbID)
      );
    } else {
      toast.success('Added to Favorites!', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      const newFavorite = {
        id: movie.id || movie.imdbID,
        title: movie.title || movie.Title,
        poster_path: movie.poster_path || movie.Poster,
        release_date: movie.release_date || movie.Year,
        vote_average: movie.vote_average || movie.imdbRating,
      };
      nextFavorites = [...currentFavorites, newFavorite];
    }
    
    window.localStorage.setItem('flickhunt_favorites', JSON.stringify(nextFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => String(fav.id) === String(movieId) || String(fav.imdbID) === String(movieId));
  };

  return { favorites, toggleFavorite, isFavorite };
};
