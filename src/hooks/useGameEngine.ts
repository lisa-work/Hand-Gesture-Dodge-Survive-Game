import { useState, useRef, useCallback, useEffect } from 'react';
import { GameState, Player, Obstacle, GameConfig } from '../types/game';

const INITIAL_GAME_STATE: GameState = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  lives: 3,
  level: 1,
  startTime: 0
};

const INITIAL_PLAYER: Player = {
  x: 400,
  y: 550,
  width: 40,
  height: 40,
  speed: 8
};

const GAME_CONFIG: GameConfig = {
  playerSpeed: 8,
  obstacleSpeed: 3,
  obstacleSpawnRate: 0.02,
  maxObstacles: 15,
  difficultyIncrease: 0.001
};

export const useGameEngine = (canvasWidth: number, canvasHeight: number) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [player, setPlayer] = useState<Player>({ ...INITIAL_PLAYER, x: canvasWidth / 2 - 20 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const obstacleIdCounter = useRef<number>(0);

  const generateObstacle = useCallback((): Obstacle => {
    const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'];
    return {
      id: `obstacle-${obstacleIdCounter.current++}`,
      x: Math.random() * (canvasWidth - 30),
      y: -30,
      width: 25 + Math.random() * 15,
      height: 25 + Math.random() * 15,
      speed: GAME_CONFIG.obstacleSpeed + gameState.level * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, [canvasWidth, gameState.level]);

  const checkCollision = useCallback((player: Player, obstacle: Obstacle): boolean => {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right' | 'center' | null) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    setPlayer(prev => {
      let newX = prev.x;
      
      if (direction === 'left') {
        newX = Math.max(0, prev.x - prev.speed);
      } else if (direction === 'right') {
        newX = Math.min(canvasWidth - prev.width, prev.x + prev.speed);
      }
      
      return { ...prev, x: newX };
    });
  }, [gameState.isPlaying, gameState.isPaused, canvasWidth]);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (!gameState.isPlaying || gameState.isPaused) return;

    // Update score based on survival time
    const newScore = Math.floor((currentTime - gameState.startTime) / 100);
    const newLevel = Math.floor(newScore / 500) + 1;

    // Spawn obstacles
    if (Math.random() < GAME_CONFIG.obstacleSpawnRate + gameState.level * 0.001) {
      setObstacles(prev => {
        if (prev.length < GAME_CONFIG.maxObstacles) {
          return [...prev, generateObstacle()];
        }
        return prev;
      });
    }

    // Move obstacles and check collisions
    setObstacles(prev => {
      const updatedObstacles = prev
        .map(obstacle => ({
          ...obstacle,
          y: obstacle.y + obstacle.speed
        }))
        .filter(obstacle => obstacle.y < canvasHeight + 50);

      // Check for collisions
      const hasCollision = updatedObstacles.some(obstacle => 
        checkCollision(player, obstacle)
      );

      if (hasCollision) {
        setGameState(prevState => {
          const newLives = prevState.lives - 1;
          if (newLives <= 0) {
            return { ...prevState, lives: 0, isPlaying: false, isGameOver: true };
          }
          return { ...prevState, lives: newLives };
        });
        
        // Remove collided obstacle
        return updatedObstacles.filter(obstacle => 
          !checkCollision(player, obstacle)
        );
      }

      return updatedObstacles;
    });

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: newScore,
      level: newLevel
    }));

    if (gameState.isPlaying && !gameState.isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState, player, generateObstacle, checkCollision, canvasHeight]);

  const startGame = useCallback(() => {
    setGameState({
      ...INITIAL_GAME_STATE,
      isPlaying: true,
      startTime: performance.now()
    });
    setPlayer({ ...INITIAL_PLAYER, x: canvasWidth / 2 - 20 });
    setObstacles([]);
    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [canvasWidth, gameLoop]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    setGameState(INITIAL_GAME_STATE);
    setPlayer({ ...INITIAL_PLAYER, x: canvasWidth / 2 - 20 });
    setObstacles([]);
  }, [canvasWidth]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameLoop]);

  return {
    gameState,
    player,
    obstacles,
    movePlayer,
    startGame,
    pauseGame,
    resetGame
  };
};