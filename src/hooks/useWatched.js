import { useState, useEffect } from 'react';

export const useWatched = () => {
  const [watched, setWatched] = useState(() => {
    try {
      const item = window.localStorage.getItem('flickhunt_watched');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn("Error reading localStorage for watched", error);
      return [];
    }
  });

  useEffect(() => {
    const syncWatched = () => {
      try {
        const item = window.localStorage.getItem('flickhunt_watched');
        setWatched(item ? JSON.parse(item) : []);
      } catch (e) {
        console.error(e);
      }
    };
    
    window.addEventListener('watchedUpdated', syncWatched);
    window.addEventListener('storage', syncWatched);
    
    return () => {
      window.removeEventListener('watchedUpdated', syncWatched);
      window.removeEventListener('storage', syncWatched);
    };
  }, []);

  const toggleWatched = (movie) => {
    const currentWatched = JSON.parse(window.localStorage.getItem('flickhunt_watched') || '[]');
    const isWatch = currentWatched.some(w => 
      (movie.id && w.id === movie.id) || 
      (movie.imdbID && w.imdbID === movie.imdbID)
    );
    
    let nextWatched;
    if (isWatch) {
      nextWatched = currentWatched.filter(w => 
        !(movie.id && w.id === movie.id) && 
        !(movie.imdbID && w.imdbID === movie.imdbID)
      );
    } else {
      const newWatched = {
        id: movie.id || movie.imdbID,
        title: movie.title || movie.Title,
        poster_path: movie.poster_path || movie.Poster,
        release_date: movie.release_date || movie.Year,
        vote_average: movie.vote_average || movie.imdbRating,
      };
      nextWatched = [...currentWatched, newWatched];
    }
    
    window.localStorage.setItem('flickhunt_watched', JSON.stringify(nextWatched));
    window.dispatchEvent(new Event('watchedUpdated'));
  };

  const isWatched = (movieId) => {
    return watched.some(w => String(w.id) === String(movieId) || String(w.imdbID) === String(movieId));
  };

  return { watched, toggleWatched, isWatched };
};
