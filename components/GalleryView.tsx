import React, { useEffect } from 'react';
import type { ImageItem } from '../types';

interface GalleryViewProps {
  items: ImageItem[];
  onClose: () => void;
  onImageClick: (item: ImageItem) => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const GalleryView: React.FC<GalleryViewProps> = ({ items, onClose, onImageClick }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#221f1c]/95 backdrop-blur-sm flex flex-col z-40 animation-fade-in"
      onClick={onClose}
    >
      <header className="flex-shrink-0 p-4 flex justify-between items-center text-white z-10 border-b border-white/10">
        <h2 className="text-xl font-bold font-serif-display">Image Gallery</h2>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </header>

      <div
        className="flex-grow p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-square bg-white/5 rounded-md overflow-hidden cursor-pointer group animation-scale-in"
              onClick={() => onImageClick(item)}
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <p className="text-white text-sm truncate">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};