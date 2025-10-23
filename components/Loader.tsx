
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="text-center text-[#f1ede9]">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#d1c9c0] mx-auto mb-4"></div>
      <h2 className="text-2xl font-serif-display font-bold">Curating your vision...</h2>
      <p className="text-[#d1c9c0]">{message}</p>
    </div>
  );
};
