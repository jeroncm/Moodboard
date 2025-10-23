
import type React from 'react';
import type { QuoteItem } from '../../types';

interface QuoteCardProps extends QuoteItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ id, text, style, onMouseDown }) => {
  return (
    <div
      data-draggable="true"
      className="absolute bg-transparent p-4 w-64 transition-transform duration-300 hover:scale-110 hover:z-20 cursor-grab"
      style={style}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <p className="font-serif-display text-2xl text-center text-[#f1ede9] leading-tight italic pointer-events-none">
        "{text}"
      </p>
    </div>
  );
};
