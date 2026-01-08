import React from 'react';
import { motion } from 'framer-motion';
import { Cell } from '../types';

interface GemProps {
  cell: Cell;
  isSelected: boolean;
  onInteract: (cell: Cell) => void;
  widthPercentage: number;
}

const Gem: React.FC<GemProps> = ({ cell, isSelected, onInteract, widthPercentage }) => {
  return (
    <motion.div
      layout
      layoutId={cell.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.15 : 1,
        opacity: 1,
        rotate: isSelected ? [0, -10, 10, 0] : 0,
        zIndex: isSelected ? 10 : 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        layout: { duration: 0.2 }
      }}
      onClick={() => onInteract(cell)}
      // Added p-1.5 here to create the spacing gap you requested
      className={`
        absolute flex items-center justify-center cursor-pointer
        select-none p-1.5
      `}
      style={{
        width: `${widthPercentage}%`,
        height: `${widthPercentage}%`,
        left: `${cell.col * widthPercentage}%`,
        top: `${cell.row * widthPercentage}%`,
      }}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={`
        w-full h-full flex items-center justify-center rounded-2xl
        transition-all duration-200
        ${isSelected 
          ? 'bg-white/60 shadow-lg ring-4 ring-white' 
          : 'hover:bg-white/20'
        }
      `}>
        <span className="text-[clamp(1.5rem,5vw,3rem)] leading-none filter drop-shadow-sm">
          {cell.type}
        </span>
      </div>
    </motion.div>
  );
};

export default React.memo(Gem);