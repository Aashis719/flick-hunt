import { Link } from 'react-router-dom';

// movie card here 
export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transform transition">
        <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
        <div className="p-3">
          <h4 className="text-lg font-semibold truncate">{movie.Title}</h4>
          <p className="text-sm text-gray-400">{movie.Year}</p>
        </div>
      </div>
    </Link>
  );
}
