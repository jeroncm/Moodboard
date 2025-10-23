
import type React from 'react';
import type { ImageItem } from '../../types';

export const ImageCard: React.FC<ImageItem> = ({ imageUrl, caption, style }) => {
  return (
    <div 
      className="absolute bg-[#f1ede9] p-3 pb-8 shadow-lg transition-transform duration-300 hover:scale-105 hover:z-20" 
      style={style}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/30 backdrop-blur-sm transform rotate-1"></div>
      <div className="bg-gray-200">
        <img src={imageUrl} alt={caption} className="w-full h-auto object-cover max-w-[250px] max-h-[250px]" />
      </div>
      <p className="absolute bottom-2 left-3 right-3 text-center text-[#70665c] font-script text-lg">{caption}</p>
    </div>
  );
};
