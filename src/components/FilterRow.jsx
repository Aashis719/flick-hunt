import React, { useState, useEffect } from 'react';

const FilterRow = ({ onFilterChange, selectedGenre, selectedYear }) => {
  const [genres, setGenres] = useState([]);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        if (data.genres) {
          setGenres(data.genres);
        }
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, [apiKey]);

  const handleGenreClick = (genreId) => {
    onFilterChange(selectedGenre === genreId ? null : genreId, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.value === "" ? null : e.target.value;
    onFilterChange(selectedGenre, year);
  };

  const handleClearFilters = () => {
    onFilterChange(null, null);
  };

  // Generate years from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(currentYear - 1900 + 1), (val, index) => currentYear - index);

  return (
    <div className="my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex-1 overflow-x-auto hide-scrollbar pb-2">
          <div className="flex space-x-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border ${
                  selectedGenre === genre.id 
                  ? 'bg-yellow-500 text-gray-900 border-yellow-500 shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <select 
            value={selectedYear || ""} 
            onChange={handleYearChange}
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Any Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {(selectedGenre || selectedYear) && (
            <button 
              onClick={handleClearFilters}
              className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterRow;
