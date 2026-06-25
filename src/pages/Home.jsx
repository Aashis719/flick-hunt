import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import FilterRow from '../components/FilterRow';
import Carousel from '../components/Carousel';
import faviLogo from '../assets/favi.png';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Category States
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    document.title = "FlickHunt";
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch 3 Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const [resTrending, resTop, resUp1, resUp2] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=2`)
        ]);
        const [dataTrending, dataTop, dataUp1, dataUp2] = await Promise.all([
          resTrending.json(), resTop.json(), resUp1.json(), resUp2.json()
        ]);
        
        const allTrending = dataTrending.results || [];
        const allTopRated = dataTop.results || [];
        const allUpcoming = [...(dataUp1.results || []), ...(dataUp2.results || [])];

        const today = new Date().toISOString().split('T')[0];
        const upcomingFiltered = allUpcoming.filter(movie => movie.release_date > today);
        
        // Exclude unreleased movies from trending and top rated
        const trendingFiltered = allTrending.filter(movie => movie.release_date && movie.release_date <= today);
        const topRatedFiltered = allTopRated.filter(movie => movie.release_date && movie.release_date <= today);
        
        setTrending(trendingFiltered);
        setTopRated(topRatedFiltered);
        setUpcoming(upcomingFiltered);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [apiKey]);

  // Fetch Search or Discover
  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedSearch.trim() && !selectedGenre && !selectedYear) {
        setMovies([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let url = '';
        if (debouncedSearch.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(debouncedSearch)}`;
        } else {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`;
          if (selectedGenre) url += `&with_genres=${selectedGenre}`;
          if (selectedYear) {
            url += `&primary_release_date.gte=${selectedYear}-01-01&primary_release_date.lte=${selectedYear}-12-31`;
          }
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error("API call failed:", err);
        setError('Failed to fetch movies. Check connection or API key.');
      }
      setLoading(false);
    };

    fetchMovies();
  }, [debouncedSearch, selectedGenre, selectedYear, apiKey]);

  const handleFilterChange = (genre, year) => {
    setSelectedGenre(genre);
    setSelectedYear(year);
  };

  const renderSkeletonsRow = () => (
    <Carousel>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-[200px] shrink-0">
          <SkeletonCard />
        </div>
      ))}
    </Carousel>
  );

  const renderGrid = (movieList) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
      {movieList.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );

  const renderSkeletonsGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8">
      {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  const isSearchOrFilterActive = debouncedSearch.trim() || selectedGenre || selectedYear;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"
    >
      <header className="pt-8 pb-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 mb-4">
          <img
            src={faviLogo}
            alt="FlickHunt Logo"
            className="h-12 w-12 md:h-16 md:w-16 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
          />
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-yellow-400 via-yellow-500 to-purple-500 text-transparent bg-clip-text [text-shadow:_0px_0px_8px_rgba(147,112,219,0.2)]">
            FlickHunt
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-400">
          Explore and discover your next favorite movie.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-2 relative group">
        <input
          type="text"
          placeholder="Search for a movie by title..."
          className="w-full p-4 pr-12 text-md bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors shadow-sm hover:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!searchTerm.trim() && (
        <FilterRow 
          onFilterChange={handleFilterChange} 
          selectedGenre={selectedGenre} 
          selectedYear={selectedYear} 
        />
      )}

      <div className="mt-8">
        {isSearchOrFilterActive ? (
          <>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
              {debouncedSearch ? `Search Results for "${debouncedSearch}"` : 'Discover Movies'}
            </h2>
            
            {loading ? (
              renderSkeletonsGrid()
            ) : error ? (
              <div className="text-center py-10 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto">
                <p className="text-md text-red-400">{error}</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-16">
                <p className="mt-1 text-lg text-gray-500">
                  No results found. Try a different search or clear your filters.
                </p>
              </div>
            ) : (
              renderGrid(movies)
            )}
          </>
        ) : (
          <div className="space-y-12">
            <section>
              {loadingCategories ? renderSkeletonsRow() : (
                <Carousel title="Trending Today" viewMoreLink="/category/trending">
                  {trending.map(movie => (
                    <div key={movie.id} className="w-[200px] shrink-0 snap-start">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </Carousel>
              )}
            </section>
            
            <section>
              {loadingCategories ? renderSkeletonsRow() : (
                <Carousel title="Top Rated" viewMoreLink="/category/top_rated">
                  {topRated.map(movie => (
                    <div key={movie.id} className="w-[200px] shrink-0 snap-start">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </Carousel>
              )}
            </section>
            
            <section>
              {loadingCategories ? renderSkeletonsRow() : (
                <Carousel title="Upcoming" viewMoreLink="/category/upcoming">
                  {upcoming.map(movie => (
                    <div key={movie.id} className="w-[200px] shrink-0 snap-start">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </Carousel>
              )}
            </section>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
