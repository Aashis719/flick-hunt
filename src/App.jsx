import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import Category from './pages/Category';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import faviLogo from './assets/favi.png';
import { Toaster } from 'react-hot-toast';
import { Home as HomeIcon, Bookmark } from 'lucide-react';

// Wrapper component to use useLocation for Framer Motion AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/category/:type" element={<Category />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white flex flex-col">
        {/* Simple Global Navigation Header */}
        <nav className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={faviLogo} alt="Logo" className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-yellow-400 tracking-tight">FlickHunt</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group/nav">
                <HomeIcon className="w-5 h-5 sm:hidden text-gray-400 group-hover/nav:text-white transition-colors" />
                <span className="hidden sm:inline text-sm font-medium">Home</span>
              </Link>
              <Link to="/favorites" className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2 group/nav">
                <Bookmark className="w-5 h-5 sm:hidden text-gray-400 group-hover/nav:text-yellow-400 transition-colors" />
                <span className="hidden sm:inline text-sm font-medium">Favorites</span>
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}
export default App;
