import React, { useState, useRef, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { CameraFeed } from './components/CameraFeed';
import { GameHUD } from './components/GameHUD';
import { StartMenu } from './components/StartMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseOverlay } from './components/PauseOverlay';
import { useGameEngine } from './hooks/useGameEngine';
import { useHandDetection } from './hooks/useHandDetection';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function App() {
  const [showStartMenu, setShowStartMenu] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    gameState,
    player,
    obstacles,
    movePlayer,
    startGame,
    pauseGame,
    resetGame
  } = useGameEngine(CANVAS_WIDTH, CANVAS_HEIGHT);

  const { gesture, isLoading, error } = useHandDetection(videoRef);

  // Handle hand gesture movement
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      movePlayer(gesture.direction);
    }
  }, [gesture.direction, gameState.isPlaying, gameState.isPaused, movePlayer]);

  const handleStartGame = () => {
    setShowStartMenu(false);
    startGame();
  };

  const handleRestart = () => {
    resetGame();
    startGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    setShowStartMenu(true);
  };

  const handlePause = () => {
    pauseGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Hidden video element for hand detection */}
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        muted
        playsInline
      />

      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu onStart={handleStartGame} />
      )}

      {/* Game Container */}
      {!showStartMenu && (
        <div className="relative">
          {/* Game HUD */}
          {gameState.isPlaying && (
            <GameHUD gameState={gameState} onPause={handlePause} />
          )}

          {/* Game Canvas */}
          <GameCanvas
            player={player}
            obstacles={obstacles}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            isPlaying={gameState.isPlaying}
          />

          {/* Camera Feed */}
          <CameraFeed 
            gesture={gesture}
            isLoading={isLoading}
            error={error}
          />

          {/* Pause Overlay */}
          {gameState.isPaused && (
            <PauseOverlay
              onResume={handlePause}
              onRestart={handleRestart}
              onMenu={handleBackToMenu}
            />
          )}

          {/* Game Over Modal */}
          {gameState.isGameOver && (
            <GameOverModal
              gameState={gameState}
              onRestart={handleRestart}
              onMenu={handleBackToMenu}
            />
          )}
        </div>
      )}

      {/* Instructions for non-game states */}
      {!showStartMenu && !gameState.isPlaying && !gameState.isGameOver && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-400 text-sm">Move your hand left or right to control the player</p>
        </div>
      )}
    </div>
  );
}

export default App;