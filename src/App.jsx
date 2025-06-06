import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
