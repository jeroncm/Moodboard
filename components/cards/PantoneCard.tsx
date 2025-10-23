
import type React from 'react';
import type { PantoneItem } from '../../types';

export const PantoneCard: React.FC<PantoneItem> = ({ colorName, hex, style }) => {
  return (
    <div 
      className="absolute w-28 h-36 shadow-lg flex flex-col transition-transform duration-300 hover:scale-110 hover:z-20" 
      style={style}
    >
        <div className="absolute top-2 right-2 w-4 h-4 bg-gray-300 rounded-full shadow-inner"></div>
        <div className="flex-grow" style={{ backgroundColor: hex }}></div>
        <div className="bg-[#f1ede9] p-2 text-center">
            <p className="font-bold text-sm text-[#544c44]">PANTONE</p>
            <p className="text-xs text-[#70665c] tracking-widest">{colorName}</p>
        </div>
    </div>
  );
};
