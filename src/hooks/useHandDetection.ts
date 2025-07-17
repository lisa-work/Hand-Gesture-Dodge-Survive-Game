import { useEffect, useRef, useState, useCallback } from 'react';
import {
  HandLandmarker,
  FilesetResolver,
  HandLandmarkerResult,
  NormalizedLandmark
} from '@mediapipe/tasks-vision';
import { HandGesture } from '../types/game';

export const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [gesture, setGesture] = useState<HandGesture>({ direction: null, confidence: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);

const drawLandmarks = (landmarks: NormalizedLandmark[]) => {
  const canvas = document.getElementById('landmark-canvas') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const video = videoRef.current;

  if (!ctx || !canvas || !video) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00FFFF';

  ctx.save();
  ctx.scale(-1, 1); // mirror horizontally
  ctx.translate(-canvas.width, 0);

  landmarks.forEach((landmark) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.restore();
};

  const detectHands = useCallback(async () => {
    if (!videoRef.current || !landmarkerRef.current) return;

    const results: HandLandmarkerResult = await landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      const wrist = landmarks[0];
      const middleTip = landmarks[12];
      const deltaX = middleTip.x - wrist.x;
      const threshold = 0.1;

      let direction: 'left' | 'right' | 'center' = 'center';
      const confidence = Math.abs(deltaX);

      if (deltaX < -threshold) direction = 'left';
      else if (deltaX > threshold) direction = 'right';

      setGesture({
        direction,
        confidence: Math.min(confidence * 5, 1),
        landmarks
      });

      drawLandmarks(landmarks);
    } else {
      setGesture({ direction: null, confidence: 0 });
      const canvas = document.getElementById('landmark-canvas') as HTMLCanvasElement;
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }

    animationFrameId.current = requestAnimationFrame(detectHands);
  }, []);

  useEffect(() => {
    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        let handLandmarker: HandLandmarker;

        try {
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 1
          });
        } catch (gpuError) {
          console.warn('GPU failed, falling back to CPU:', gpuError);
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 1
          });
        }

        landmarkerRef.current = handLandmarker;

        const waitUntilVideoIsReady = () => {
          const video = videoRef.current;
          if (
            video &&
            video.readyState >= 3 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            detectHands();
          } else {
            setTimeout(waitUntilVideoIsReady, 100);
          }
        };

        waitUntilVideoIsReady();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize hand detection:', err);
        setError('Failed to initialize hand detection.');
        setIsLoading(false);
      }
    };

    setup();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [detectHands]);

  return { gesture, isLoading, error };
};
