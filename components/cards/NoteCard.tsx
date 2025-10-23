
import type React from 'react';
import type { NoteItem } from '../../types';

export const NoteCard: React.FC<NoteItem> = ({ text, style }) => {
  return (
    <div 
      className="absolute bg-[#d1c9c0] p-4 shadow-md w-48 h-24 transition-transform duration-300 hover:scale-110 hover:z-20"
      style={style}
    >
       <div className="absolute top-2 left-2 w-4 h-4 bg-gray-400/50 rounded-full shadow-inner"></div>
      <p className="font-script text-2xl text-center text-[#544c44] leading-tight flex items-center justify-center h-full">
        {text}
      </p>
    </div>
  );
};
