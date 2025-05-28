import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams(); // Get movie ID from URL params
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_TMDB_API_KEY&append_to_response=credits,release_dates`);
        const data = await response.json();
        if (data.success === false) { // TMDB uses `success: false` for errors like not found
          setError(data.status_message || 'Movie not found by ID.');
          setMovie(null);
        } else {
           // Extract director from credits
          const director = data.credits?.crew?.find(person => person.job === 'Director');
          // Extract MPAA rating for US if available
          let mpaaRating = 'N/A';
          const usRelease = data.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
          if (usRelease && usRelease.release_dates.length > 0) {
            const certification = usRelease.release_dates[0].certification;
            if (certification) {
                mpaaRating = certification;
            }
          }

          const formattedMovie = {
            id: data.id,
            Title: data.title,
            Year: data.release_date ? data.release_date.substring(0, 4) : 'N/A',
            Poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/400x600.png?text=No+Image',
            Plot: data.overview,
            Rated: mpaaRating, // MPAA rating
            Runtime: data.runtime ? `${data.runtime} min` : 'N/A',
            Genre: data.genres?.map(g => g.name).join(', ') || 'N/A',
            Director: director ? director.name : 'N/A',
            Actors: data.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A', // Top 5 actors
            Released: data.release_date,
            Language: data.original_language ? data.original_language.toUpperCase() : 'N/A',
            Country: data.production_countries?.map(c => c.name).join(', ') || 'N/A',
            imdbRating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
            imdbVotes: data.vote_count ? data.vote_count.toLocaleString() : 'N/A',
            // TMDB doesn't directly provide multiple "Ratings" sources like OMDB, so we focus on TMDB's own vote average.
            // Awards are also not a standard direct field in the main movie details like OMDB.
          };
          setMovie(formattedMovie);
        }
      } catch (err) {
        console.error("API call failed:", err);
        setError('Failed to fetch movie details. Please try again later.');
        setMovie(null);
      }
      setLoading(false);
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400 text-xl py-10">Loading movie details...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl py-10">
        <p>Error: {error}</p>
        <Link to="/" className="mt-4 inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center text-gray-500 text-xl py-10">
        <p>Movie not found.</p>
        <Link to="/" className="mt-4 inline-block bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden md:flex">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600.png?text=No+Image'} 
          alt={movie.Title} 
          className="w-full md:w-1/3 h-auto object-cover" 
        />
        <div className="p-6 md:p-8 flex-grow">
          <h1 className="text-4xl font-bold text-yellow-400 mb-3">{movie.Title} <span className="text-2xl text-gray-400">({movie.Year})</span></h1>
          <p className="text-sm text-gray-500 bg-gray-700 inline-block px-3 py-1 rounded-full mb-4">
            {movie.Rated} &bull; {movie.Runtime} &bull; {movie.Genre}
          </p>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Plot</h2>
            <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Director</h3>
              <p className="text-gray-400">{movie.Director}</p>
            </div>
            {/* Writer field is not as straightforward in TMDB, often part of crew with various roles */}
            {/* <h3 className="text-xl font-semibold text-yellow-300 mb-1">Writer</h3>
            <p className="text-gray-400">{movie.Writer}</p> */}
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Top Billed Cast</h3>
              <p className="text-gray-400">{movie.Actors}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Released</h3>
              <p className="text-gray-400">{movie.Released}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Language</h3>
              <p className="text-gray-400">{movie.Language}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Country</h3>
              <p className="text-gray-400">{movie.Country}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Ratings</h2>
            {/* TMDB primarily provides its own rating. Other sources like IMDB, Rotten Tomatoes are not direct fields. */}
            <div className="bg-gray-700 p-3 rounded-lg mb-2">
                <span className="font-semibold text-yellow-400">TMDB Rating:</span> <span className="text-gray-300">{movie.imdbRating}/10 ({movie.imdbVotes} votes)</span>
            </div>
            {/* {movie.Ratings && movie.Ratings.map((rating, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg mb-2">
                <span className="font-semibold text-yellow-400">{rating.Source}:</span> <span className="text-gray-300">{rating.Value}</span>
              </div>
            ))}
            {(!movie.Ratings || movie.Ratings.length === 0) && <p className="text-gray-400">No ratings available.</p>} */}
          </div>

          {/* <div className="mb-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-1">IMDb Rating</h3>
            <p className="text-4xl text-yellow-500 font-bold">{movie.imdbRating}/10 <span className="text-lg text-gray-400">({movie.imdbVotes} votes)</span></p>
          </div> */}
          
          {/* Awards are not a direct field in TMDB movie details */}
          {/* {movie.Awards && movie.Awards !== "N/A" && (
             <div className="mb-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">Awards</h3>
              <p className="text-gray-400">{movie.Awards}</p>
            </div>
          )} */}

          <div className="mt-8 text-center md:text-left">
            <Link to="/" className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors text-lg font-semibold">
              &larr; Back to Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
