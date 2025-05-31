export default function Search({ setQuery }) {
  return (
    // search here 
    // the search component is the search bar that allows the user to search for movies
    // it is a search bar that allows the user to search for movies
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
