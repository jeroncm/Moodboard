import type React from 'react';
import type { QuoteItem } from '../../types';

interface QuoteCardProps extends QuoteItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ id, text, style, onMouseDown }) => {
  return (
    <div
      data-draggable="true"
      className="absolute bg-transparent p-4 w-64 transition-transform duration-300 ease-in-out hover:scale-105 hover:z-20 cursor-grab group"
      style={style}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <p className="font-serif-display text-2xl text-center text-[#f1ede9] leading-tight italic pointer-events-none transition-all duration-300 ease-in-out group-hover:text-white group-hover:[text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
        "{text}"
      </p>
    </div>
  );
};
