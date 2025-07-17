import React from 'react';
import { Play, Home, RotateCcw } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ 
  onResume, 
  onRestart, 
  onMenu 
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-gray-900/90 border-2 border-cyan-400 rounded-lg p-8 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Game Paused</h2>
        
        <div className="space-y-3 min-w-[200px]">
          <button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Resume</span>
            </div>
          </button>
          
          <button
            onClick={onRestart}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Restart</span>
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