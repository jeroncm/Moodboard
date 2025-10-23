// Fix: Import React to use React.CSSProperties type.
import type React from 'react';

export enum ItemType {
  Image,
  Pantone,
  Ticket,
  Note,
  Quote,
}

interface BaseItem {
  id: string;
  style: React.CSSProperties;
}

export interface ImageItem extends BaseItem {
  type: ItemType.Image;
  imageUrl: string;
  caption: string;
}

export interface PantoneItem extends BaseItem {
  type: ItemType.Pantone;
  colorName: string;
  hex: string;
}

export interface TicketItem extends BaseItem {
  type: ItemType.Ticket;
  title: string;
  details: {
    where: string;
    when: string;
  };
}

export interface NoteItem extends BaseItem {
  type: ItemType.Note;
  text: string;
}

export interface QuoteItem extends BaseItem {
  type: ItemType.Quote;
  text: string;
}

export type MoodBoardItem = ImageItem | PantoneItem | TicketItem | NoteItem | QuoteItem;
