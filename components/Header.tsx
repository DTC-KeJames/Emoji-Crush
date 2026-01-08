import React from 'react';
import { Clock, Trophy, RotateCcw } from 'lucide-react';

interface HeaderProps {
  score: number;
  timeLeft: number;
  onRestart: () => void;
}

const Header: React.FC<HeaderProps> = ({ score, timeLeft, onRestart }) => {
  const isWarning = timeLeft <= 10;

  return (
    <div className="w-full max-w-md px-4 py-4 flex flex-col gap-4">
      {/* Title */}
      <h1 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-sm tracking-tight font-sans">
        Emoji Crush
      </h1>

      {/* Stats Bar */}
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-white/50">
        
        {/* Score */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
            <Trophy size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            <span className="text-xl font-black text-slate-700 leading-none">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 transition-colors duration-300 ${isWarning ? 'text-red-500' : 'text-slate-700'}`}>
          <div className={`p-2 rounded-xl ${isWarning ? 'bg-red-100 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-bold text-slate-400 uppercase">Time</span>
             <span className="text-xl font-black leading-none">{timeLeft}s</span>
          </div>
        </div>

        {/* Restart Button */}
        <button 
          onClick={onRestart}
          className="p-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 active:scale-90 transition-all"
        >
          <RotateCcw size={20} />
        </button>

      </div>
    </div>
  );
};

export default Header;