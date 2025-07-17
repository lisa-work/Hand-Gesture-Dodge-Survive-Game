import React, { useRef, useEffect } from 'react';
import { Player, Obstacle } from '../types/game';

interface GameCanvasProps {
  player: Player;
  obstacles: Obstacle[];
  width: number;
  height: number;
  isPlaying: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  player,
  obstacles,
  width,
  height,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a0033');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(64, 224, 208, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    if (isPlaying) {
      // Draw player with glow effect
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      
      // Player body
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Player core
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(player.x + 8, player.y + 8, player.width - 16, player.height - 16);
      
      ctx.shadowBlur = 0;

      // Draw obstacles
      obstacles.forEach(obstacle => {
        ctx.shadowColor = obstacle.color;
        ctx.shadowBlur = 15;
        
        // Obstacle body
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Obstacle core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(
          obstacle.x + obstacle.width * 0.3,
          obstacle.y + obstacle.height * 0.3,
          obstacle.width * 0.4,
          obstacle.height * 0.4
        );
        
        ctx.shadowBlur = 0;
      });
    }
  }, [player, obstacles, width, height, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-cyan-400 rounded-lg shadow-2xl bg-gray-900"
      style={{ filter: 'brightness(1.1) contrast(1.2)' }}
    />
  );
};