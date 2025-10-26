import type React from 'react';
import type { TicketItem } from '../../types';

interface TicketCardProps extends TicketItem {
  onMouseDown: (event: React.MouseEvent, id: string) => void;
}


export const TicketCard: React.FC<TicketCardProps> = ({ id, title, details, style, onMouseDown }) => {
  return (
    <div
      data-draggable="true"
      className="absolute bg-[#f1ede9] w-80 shadow-lg text-[#544c44] p-4 flex flex-col gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-20 cursor-grab"
      style={{
        ...style,
        maskImage: 'radial-gradient(circle at -1% 50%, transparent 0.5rem, #000 0.5rem), radial-gradient(circle at 101% 50%, transparent 0.5rem, #000 0.5rem)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'destination-in',
      }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-white/30 backdrop-blur-sm pointer-events-none"></div>
      <div className='pointer-events-none'>
        <p className="text-xs uppercase tracking-wider text-[#8a8178]">Admit One</p>
        <h3 className="text-3xl font-serif-display font-bold leading-tight">{title}</h3>
        <div className="border-t border-dashed border-[#a1988e] my-2"></div>
        <div className="flex justify-between text-xs uppercase">
          <div>
            <p className="font-bold">Where</p>
            <p>{details.where}</p>
          </div>
          <div>
            <p className="font-bold">When</p>
            <p>{details.when}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
