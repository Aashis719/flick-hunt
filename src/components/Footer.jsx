import React from 'react';
import { Film } from 'lucide-react';
import faviLogo from '../assets/favi.png';

const Footer = () => {
  return (
    <footer className="relative mt-auto bg-gray-950 bg-gray-950 shadow-[0_-20px_30px_-15px] shadow-yellow-500/20 rounded-t-4xl">
      <div className="relative w-full overflow-hidden rounded-t-4xl">
        
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0 rounded-t-4xl">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-950 via-gray-950/40 via-gray-950/30   to-transparent z-10 rounded-t-4xl" />
          <div className="absolute inset-0 bg-gray-950/40 z-10 rounded-t-4xl" />
          <img 
            src="/footerimage.png" 
            alt="Cinematic Background" 
            className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-x-1 gap-y-2 mb-4">
                        <img
                          src={faviLogo}
                          alt="FlickHunt Logo"
                          className="h-12 w-12 md:h-16 md:w-16 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                        />
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-yellow-400 via-yellow-500 to-purple-500 text-transparent bg-clip-text [text-shadow:_0px_0px_8px_rgba(147,112,219,0.2)]">
                          FlickHunt
                        </h1>
                      </div>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Your ultimate cinematic companion. Discover trending blockbusters, manage your personal watchlist, and curate your favorite films in one seamless experience.
            </p>
          </div>

         
        </div>
      </div>

    </footer>
  );
};

export default Footer;
