import React from 'react';
import { Play, Hand, ArrowLeft, ArrowRight } from 'lucide-react';
import { GoGoal } from "react-icons/go";
import { MdOutlineTipsAndUpdates } from "react-icons/md";

interface StartMenuProps {
  onStart: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center z-50">
      <div className="max-w-2xl mx-auto p-8 text-center">
        {/* Game Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            DODGE & SURVIVE
          </h1>
          <p className="text-xl text-gray-300">Use hand gestures to survive the falling obstacles</p>
        </div>

        {/* How to Play */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-400 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <ArrowLeft className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Move Hand Left</p>
              <p className="text-gray-400 text-sm">Move your hand left to dodge right</p>
            </div>
            <div className="p-4">
              <Hand className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Center Position</p>
              <p className="text-gray-400 text-sm">Keep hand centered to stay in place</p>
            </div>
            <div className="p-4">
              <ArrowRight className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">Move Hand Right</p>
              <p className="text-gray-400 text-sm">Move your hand right to dodge left</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <Play className="w-6 h-6 group-hover:animate-pulse" />
            <span>Start Game</span>
          </div>
        </button>

        {/* Tips */}
        <div className="mt-8 text-gray-400 text-sm space-y-2">
          <p className="flex flex-row gap-1 items-center justify-center"><MdOutlineTipsAndUpdates size={25}/> Tip: Allow camera access for hand gesture detection</p>
          <p className="flex flex-row gap-1 items-center justify-center"><GoGoal size={25}/> Survive as long as possible to increase your score</p>
        </div>
      </div>
    </div>
  );
};