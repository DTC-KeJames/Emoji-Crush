import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'framer-motion';

import { Cell, GameState } from './types';
import { BOARD_SIZE, GAME_DURATION, POINTS_PER_GEM } from './constants';
import { generateBoard, findMatches, isAdjacent, getRandomEmoji } from './services/gameService';
import Header from './components/Header';
import Gem from './components/Gem';
import GameOver from './components/GameOver';

const App: React.FC = () => {
  // Game State
  const [board, setBoard] = useState<Cell[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  
  // Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState !== GameState.GAME_OVER && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState(GameState.GAME_OVER);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Initial Setup
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setBoard(generateBoard());
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState(GameState.IDLE);
    setSelectedCell(null);
  };

  /**
   * Main cascading logic.
   */
  const processBoard = useCallback(async (currentBoard: Cell[], isUserMove: boolean) => {
    // 1. Find matches
    const matchedIds = findMatches(currentBoard);

    if (matchedIds.length === 0) {
      // No matches found.
      setGameState(GameState.IDLE);
      return;
    }

    // 2. State: Matching
    setGameState(GameState.MATCHING);
    
    // Add Score
    if (matchedIds.length > 0) {
        setScore(prev => prev + (matchedIds.length * POINTS_PER_GEM));
    }

    // Wait for disappear animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Remove matches
    let grid: (Cell | null)[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    currentBoard.forEach(c => {
      if (!matchedIds.includes(c.id)) {
        grid[c.row][c.col] = c;
      }
    });

    // 4. Apply Gravity
    const newBoardCells: Cell[] = [];
    
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySlots = 0;
      
      // Process from bottom to top
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (grid[row][col] === null) {
          emptySlots++;
        } else if (emptySlots > 0) {
          // Move cell down
          const cell = grid[row][col]!;
          cell.row += emptySlots;
          grid[row][col] = null;
          grid[cell.row][col] = cell;
        }
      }
    }

    // Reconstruct flat board and generate new ones for the nulls
    const finalCells: Cell[] = [];
    
    for (let col = 0; col < BOARD_SIZE; col++) {
       let currentRow = BOARD_SIZE - 1;
       const colCells = currentBoard.filter(c => c.col === col && !matchedIds.includes(c.id));
       colCells.sort((a, b) => b.row - a.row);
       
       colCells.forEach((cell, idx) => {
          cell.row = BOARD_SIZE - 1 - idx;
          finalCells.push(cell);
       });

       const numMissing = BOARD_SIZE - colCells.length;
       for (let i = 0; i < numMissing; i++) {
         finalCells.push({
           id: uuidv4(),
           type: getRandomEmoji(),
           col: col,
           row: (numMissing - 1) - i
         });
       }
    }

    setBoard(finalCells);
    setGameState(GameState.DROPPING);

    await new Promise(resolve => setTimeout(resolve, 500));

    processBoard(finalCells, false);

  }, []);


  const handleCellInteraction = async (clickedCell: Cell) => {
    if (gameState !== GameState.IDLE) return;

    if (!selectedCell) {
      setSelectedCell(clickedCell);
      return;
    }

    if (selectedCell.id === clickedCell.id) {
      setSelectedCell(null);
      return;
    }

    if (!isAdjacent(selectedCell, clickedCell)) {
      setSelectedCell(clickedCell);
      return;
    }

    setGameState(GameState.SWAPPING);
    
    const newBoard = board.map(c => {
      if (c.id === selectedCell.id) return { ...c, row: clickedCell.row, col: clickedCell.col };
      if (c.id === clickedCell.id) return { ...c, row: selectedCell.row, col: selectedCell.col };
      return c;
    });

    setBoard(newBoard);
    setSelectedCell(null);

    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = findMatches(newBoard);

    if (matches.length > 0) {
      processBoard(newBoard, true);
    } else {
      const revertedBoard = newBoard.map(c => {
        if (c.id === selectedCell.id) return { ...c, row: selectedCell.row, col: selectedCell.col };
        if (c.id === clickedCell.id) return { ...c, row: clickedCell.row, col: clickedCell.col };
        return c;
      });
      setBoard(revertedBoard);
      setGameState(GameState.IDLE);
    }
  };

  const cellSizePercentage = 100 / BOARD_SIZE;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
         <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍬</div>
         <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-pulse">🍭</div>
         <div className="absolute top-1/2 left-5 text-4xl opacity-20 rotate-45">🍩</div>
      </div>

      <Header score={score} timeLeft={timeLeft} onRestart={startNewGame} />

      {/* Game Board Area */}
      <div className="w-full max-w-md p-4 relative z-10">
        <div 
          className="relative w-full aspect-square bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden"
          style={{ touchAction: 'none' }}
        >
          <AnimatePresence>
            {board.map((cell) => (
              <Gem
                key={cell.id}
                cell={cell}
                widthPercentage={cellSizePercentage}
                isSelected={selectedCell?.id === cell.id}
                onInteract={handleCellInteraction}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Instructions */}
      <div className="mt-4 text-slate-500 text-sm font-medium text-center px-6">
        <p>Tap two adjacent emojis to swap.</p>
        <p>Match 3 or more to score!</p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameState === GameState.GAME_OVER && (
          <GameOver score={score} onRestart={startNewGame} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;