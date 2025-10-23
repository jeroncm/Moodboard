
import type React from 'react';
import type { PantoneItem } from '../../types';

interface PantoneCardProps extends PantoneItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
}

export const PantoneCard: React.FC<PantoneCardProps> = ({ id, colorName, hex, style, onMouseDown }) => {
  return (
    <div
      data-draggable="true"
      className="absolute w-28 h-36 shadow-lg flex flex-col transition-transform duration-300 hover:scale-110 hover:z-20 cursor-grab"
      style={style}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
        <div className="absolute top-2 right-2 w-4 h-4 bg-gray-300 rounded-full shadow-inner pointer-events-none"></div>
        <div className="flex-grow pointer-events-none" style={{ backgroundColor: hex }}></div>
        <div className="bg-[#f1ede9] p-2 text-center pointer-events-none">
            <p className="font-bold text-sm text-[#544c44]">PANTONE</p>
            <p className="text-xs text-[#70665c] tracking-widest">{colorName}</p>
        </div>
    </div>
  );
};
