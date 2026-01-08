import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center border-4 border-pink-100"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full mb-6 shadow-inner">
          <Trophy size={40} fill="currentColor" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">Time's Up!</h2>
        <p className="text-slate-500 mb-8 font-medium">Amazing job! Here is your final score:</p>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600">
            {score.toLocaleString()}
          </span>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          Play Again
        </button>
      </motion.div>
    </div>
  );
};

export default GameOver;