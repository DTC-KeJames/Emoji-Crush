import { Cell, EmojiType, Position } from '../types';
import { BOARD_SIZE, EMOJIS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a random emoji type
 */
export const getRandomEmoji = (): EmojiType => {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

/**
 * Generates the initial board ensuring no pre-existing matches
 */
export const generateBoard = (): Cell[] => {
  const cells: Cell[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      let type: EmojiType;
      
      // Keep generating until no match is formed
      do {
        type = getRandomEmoji();
      } while (
        (col >= 2 && cells[row * BOARD_SIZE + col - 1].type === type && cells[row * BOARD_SIZE + col - 2].type === type) ||
        (row >= 2 && cells[(row - 1) * BOARD_SIZE + col].type === type && cells[(row - 2) * BOARD_SIZE + col].type === type)
      );

      cells.push({
        id: uuidv4(),
        type,
        row,
        col
      });
    }
  }
  return cells;
};

/**
 * Checks for matches in the current board state
 */
export const findMatches = (cells: Cell[]): string[] => {
  const matchedIds = new Set<string>();

  // Helper to get cell at coordinates
  const getCell = (r: number, c: number) => {
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return null;
    return cells.find(cell => cell.row === r && cell.col === c) || null;
  };

  // Horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 2; col++) {
      const c1 = getCell(row, col);
      const c2 = getCell(row, col + 1);
      const c3 = getCell(row, col + 2);

      if (c1 && c2 && c3 && c1.type === c2.type && c2.type === c3.type) {
        matchedIds.add(c1.id);
        matchedIds.add(c2.id);
        matchedIds.add(c3.id);
      }
    }
  }

  // Vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      const c1 = getCell(row, col);
      const c2 = getCell(row + 1, col);
      const c3 = getCell(row + 2, col);

      if (c1 && c2 && c3 && c1.type === c2.type && c2.type === c3.type) {
        matchedIds.add(c1.id);
        matchedIds.add(c2.id);
        matchedIds.add(c3.id);
      }
    }
  }

  return Array.from(matchedIds);
};

/**
 * Checks if two positions are adjacent
 */
export const isAdjacent = (p1: Position, p2: Position): boolean => {
  const dx = Math.abs(p1.col - p2.col);
  const dy = Math.abs(p1.row - p2.row);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};