import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow animate-pulse">
      <div className="w-full h-64 bg-gray-700"></div>
      <div className="p-3">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
