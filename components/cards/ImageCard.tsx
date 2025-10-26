import type React from 'react';
import type { ImageItem } from '../../types';

interface ImageCardProps extends ImageItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ id, imageUrl, caption, style, onMouseDown }) => {
  return (
    <div
      data-draggable="true"
      className="absolute bg-[#f1ede9] p-3 pb-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-20 cursor-grab"
      style={style}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/30 backdrop-blur-sm transform rotate-1"></div>
      <div className="bg-gray-200 pointer-events-none">
        <img src={imageUrl} alt={caption} className="w-full h-auto object-cover max-w-[250px] max-h-[250px]" />
      </div>
      <p className="absolute bottom-2 left-3 right-3 text-center text-[#70665c] font-script text-lg pointer-events-none">{caption}</p>
    </div>
  );
};
