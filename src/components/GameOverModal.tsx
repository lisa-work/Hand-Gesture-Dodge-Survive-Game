import React from 'react';
import { GameState } from '../types/game';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  gameState, 
  onRestart, 
  onMenu 
}) => {
  const getScoreRating = (score: number) => {
    if (score < 100) return { text: 'Keep Practicing!', color: 'text-red-400' };
    if (score < 500) return { text: 'Good Job!', color: 'text-yellow-400' };
    if (score < 1000) return { text: 'Excellent!', color: 'text-green-400' };
    return { text: 'LEGENDARY!', color: 'text-purple-400' };
  };

  const rating = getScoreRating(gameState.score);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-400 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Game Over Title */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-red-400 mb-2">GAME OVER</h2>
          <p className={`text-xl font-semibold ${rating.color}`}>{rating.text}</p>
        </div>

        {/* Stats */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
              <div className="text-gray-400 text-sm">Final Score</div>
            </div>
            <div>
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded mx-auto mb-2 flex items-center justify-center text-white font-bold">
                {gameState.level}
              </div>
              <div className="text-2xl font-bold text-white">{gameState.level}</div>
              <div className="text-gray-400 text-sm">Level Reached</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </div>
          </button>
          
          <button
            onClick={onMenu}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Main Menu</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};