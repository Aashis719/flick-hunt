import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Carousel = ({ children, title, viewMoreLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
      {title && (
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-2xl font-semibold text-yellow-400">{title}</h2>
          {viewMoreLink && (
            <Link to={viewMoreLink} className="text-sm font-medium text-gray-400 hover:text-yellow-400 transition-colors">
              View All &rarr;
            </Link>
          )}
        </div>
      )}
      
      {/* Left Button */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg border border-gray-700/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 pt-2 px-2 -mx-2 snap-x scroll-smooth"
      >
        {children}
        
        {/* "More" Card if viewMoreLink is provided */}
        {viewMoreLink && (
          <div className="w-[200px] shrink-0 snap-start flex items-stretch">
            <Link 
              to={viewMoreLink} 
              className="w-full bg-gray-800 rounded-lg shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 border-2 border-dashed border-gray-600 hover:border-yellow-500/50 flex flex-col items-center justify-center p-6 text-gray-400 hover:text-yellow-400 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-yellow-500/20 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-semibold text-center">View More Movies</span>
            </Link>
          </div>
        )}
      </div>

      {/* Right Button */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg border border-gray-700/50 opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Carousel;
