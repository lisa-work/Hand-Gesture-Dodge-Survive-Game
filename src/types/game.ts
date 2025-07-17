import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  lives: number;
  level: number;
  startTime: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface HandGesture {
  direction: 'left' | 'right' | 'center' | null;
  confidence: number;
  landmarks?: NormalizedLandmark[];
}

export interface GameConfig {
  playerSpeed: number;
  obstacleSpeed: number;
  obstacleSpawnRate: number;
  maxObstacles: number;
  difficultyIncrease: number;
}