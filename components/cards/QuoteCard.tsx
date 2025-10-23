
import type React from 'react';
import type { QuoteItem } from '../../types';

export const QuoteCard: React.FC<QuoteItem> = ({ text, style }) => {
  return (
    <div 
      className="absolute bg-transparent p-4 w-64 transition-transform duration-300 hover:scale-110 hover:z-20"
      style={style}
    >
      <p className="font-serif-display text-2xl text-center text-[#f1ede9] leading-tight italic">
        "{text}"
      </p>
    </div>
  );
};
