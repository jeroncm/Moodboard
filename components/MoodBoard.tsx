import React, { forwardRef } from 'react';
import type { MoodBoardItem } from '../types';
import { ItemType } from '../types';
import { ImageCard } from './cards/ImageCard';
import { PantoneCard } from './cards/PantoneCard';
import { TicketCard } from './cards/TicketCard';
import { NoteCard } from './cards/NoteCard';
import { QuoteCard } from './cards/QuoteCard';

interface MoodBoardProps {
  items: MoodBoardItem[];
  onMouseDown: (event: React.MouseEvent, id: string) => void;
  onItemClick: (item: MoodBoardItem) => void;
}

export const MoodBoard = forwardRef<HTMLDivElement, MoodBoardProps>(({ items, onMouseDown, onItemClick }, ref) => {
  return (
    <div ref={ref} className="relative w-full max-w-5xl h-[70vh] min-h-[600px]">
      {items.map((item) => {
        switch (item.type) {
          case ItemType.Image:
            return <ImageCard key={item.id} {...item} onMouseDown={onMouseDown} onItemClick={onItemClick} />;
          case ItemType.Pantone:
            return <PantoneCard key={item.id} {...item} onMouseDown={onMouseDown} onItemClick={onItemClick} />;
          case ItemType.Ticket:
            return <TicketCard key={item.id} {...item} onMouseDown={onMouseDown} onItemClick={onItemClick} />;
          case ItemType.Note:
            return <NoteCard key={item.id} {...item} onMouseDown={onMouseDown} onItemClick={onItemClick} />;
          case ItemType.Quote:
            return <QuoteCard key={item.id} {...item} onMouseDown={onMouseDown} onItemClick={onItemClick} />;
          default:
            return null;
        }
      })}
    </div>
  );
});