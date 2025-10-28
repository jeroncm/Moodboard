import React, { useEffect } from 'react';
import type { MoodBoardItem } from '../types';
import { ItemType } from '../types';

interface ZoomViewProps {
  item: MoodBoardItem;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const DownloadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


export const ZoomView: React.FC<ZoomViewProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = () => {
    if (item.type !== ItemType.Image) return;
    const link = document.createElement('a');
    link.href = item.imageUrl;
    const filename = (item.caption || 'mood-board-image').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderZoomedContent = () => {
    switch (item.type) {
      case ItemType.Image:
        return (
          <div className="p-2 bg-white rounded-lg shadow-2xl">
            <img
              src={item.imageUrl}
              alt={item.caption}
              className="block max-w-full max-h-[calc(85vh-1rem)] object-contain rounded-md"
            />
          </div>
        );
      case ItemType.Pantone:
        return (
          <div className="w-80 h-80 md:w-96 md:h-96 flex flex-col rounded-lg overflow-hidden shadow-2xl">
            <div className="flex-grow" style={{ backgroundColor: item.hex }}></div>
            <div className="bg-[#f1ede9] p-4 text-center">
              <p className="font-bold text-2xl text-[#544c44]">PANTONE</p>
              <p className="text-xl text-[#70665c] tracking-widest">{item.colorName}</p>
            </div>
          </div>
        );
      case ItemType.Ticket:
        return (
            <div className="bg-[#f1ede9] w-[90vw] max-w-[500px] shadow-2xl text-[#544c44] p-8 flex flex-col gap-4 rounded-lg">
                <p className="text-lg uppercase tracking-wider text-[#8a8178]">Admit One</p>
                <h3 className="text-5xl font-serif-display font-bold leading-tight">{item.title}</h3>
                <div className="border-t border-dashed border-[#a1988e] my-2"></div>
                <div className="flex justify-between text-lg uppercase">
                <div>
                    <p className="font-bold">Where</p>
                    <p>{item.details.where}</p>
                </div>
                <div>
                    <p className="font-bold">When</p>
                    <p>{item.details.when}</p>
                </div>
                </div>
            </div>
        );
      case ItemType.Note:
        return (
            <div className="bg-[#d1c9c0] p-8 shadow-2xl w-96 h-64 flex items-center justify-center rounded-lg">
                <p className="font-script text-5xl text-center text-[#544c44] leading-tight">
                    {item.text}
                </p>
            </div>
        );
       case ItemType.Quote:
        return (
            <div className="p-8 w-[90vw] max-w-[600px]">
                 <p className="font-serif-display text-4xl md:text-5xl text-center text-[#f1ede9] leading-tight italic [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    "{item.text}"
                </p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animation-fade-in"
      onClick={onClose}
    >
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-10">
        <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
        >
            <CloseIcon />
        </button>
        <div className="flex items-center gap-4">
            {item.type === ItemType.Image && (
              <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Download Image"
              >
                  <DownloadIcon />
              </button>
            )}
            <button
                className="px-4 py-2 bg-white text-black rounded-full font-semibold text-sm"
                onClick={(e) => e.stopPropagation()}
            >
                Share
            </button>
        </div>
      </header>

      <div
        className="relative transition-transform duration-300 animation-scale-in max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {renderZoomedContent()}
      </div>
    </div>
  );
};