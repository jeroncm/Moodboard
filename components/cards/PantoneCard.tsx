import type React from 'react';
import type { PantoneItem } from '../../types';

interface PantoneCardProps extends PantoneItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
  onItemClick: (item: PantoneItem) => void;
}

export const PantoneCard: React.FC<PantoneCardProps> = ({ onMouseDown, onItemClick, ...item }) => {
  const { id, colorName, hex, style } = item;
  return (
    <div
      data-draggable="true"
      className="absolute w-28 h-36 shadow-lg flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-20 cursor-grab"
      style={style}
      onMouseDown={(e) => onMouseDown(e, id)}
      onClick={() => onItemClick(item)}
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