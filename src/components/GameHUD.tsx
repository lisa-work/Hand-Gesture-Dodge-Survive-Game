import React from 'react';
import { GameState } from '../types/game';
import { Heart, Trophy, Timer, Pause, Play } from 'lucide-react';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState, onPause }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const survivalTime = gameState.isPlaying 
    ? performance.now() - gameState.startTime 
    : 0;

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
      {/* Left side - Score and Level */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400 rounded-lg p-4 min-w-[200px]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-yellow-400 text-sm font-medium">Score</div>
              <div className="text-white text-xl font-bold">{gameState.score}</div>
            </div>
          </div>
          
          <div className="w-px h-12 bg-gray-600"></div>
          
          <div>
            <div className="text-cyan-400 text-sm font-medium">Level</div>
            <div className="text-white text-xl font-bold">{gameState.level}</div>
          </div>
        </div>
      </div>

      {/* Center - Pause Button */}
      <button
        onClick={onPause}
        className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400 rounded-lg p-3 hover:bg-gray-800/80 transition-all duration-200 hover:scale-105"
      >
        {gameState.isPaused ? (
          <Play className="w-6 h-6 text-cyan-400" />
        ) : (
          <Pause className="w-6 h-6 text-cyan-400" />
        )}
      </button>

      {/* Right side - Lives and Time */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400 rounded-lg p-4 min-w-[200px]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-red-400 text-sm font-medium">Lives</div>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < gameState.lives ? 'text-red-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-px h-12 bg-gray-600"></div>
          
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-400 text-sm font-medium">Time</div>
              <div className="text-white text-xl font-bold">{formatTime(survivalTime)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};