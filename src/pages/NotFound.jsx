import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-grow flex items-center justify-center min-h-[70vh] px-4"
    >
      <div className="text-center">
        <h1 className="text-9xl font-bold text-yellow-500 mb-4 opacity-80">404</h1>
        <h2 className="text-3xl font-semibold text-gray-200 mb-6">Lost in the cinematic universe...</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
          We couldn't find the page you're looking for. It might have been beamed up by aliens or just moved
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-400 transition-all font-bold shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-1"
        >
          Take Me Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
