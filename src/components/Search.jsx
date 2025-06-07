export default function Search({ setQuery }) {
  return (
    // src/components/Search.jsx
    // A simple search input component for movies
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Search movies..."
        onChange={(e) => setQuery(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
