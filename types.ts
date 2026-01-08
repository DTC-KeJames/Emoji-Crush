export type EmojiType = '🍎' | '🍇' | '🍊' | '🍋' | '🫐' | '🥥';

export interface Cell {
  id: string; // Unique ID for Framer Motion keys
  type: EmojiType;
  row: number;
  col: number;
  isMatched?: boolean;
}

export enum GameState {
  IDLE,
  SWAPPING,
  MATCHING,
  DROPPING,
  GAME_OVER
}

export interface Position {
  row: number;
  col: number;
}