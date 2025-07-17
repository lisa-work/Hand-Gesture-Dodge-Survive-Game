// import { useRef, useEffect, useState, useCallback } from 'react';
// import { Hands, Results } from '@mediapipe/hands';
// import { Camera } from '@mediapipe/camera_utils';
// import { HandGesture } from '../types/game';

// export const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
//   const [gesture, setGesture] = useState<HandGesture>({ direction: null, confidence: 0 });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const handsRef = useRef<Hands | null>(null);
//   const cameraRef = useRef<Camera | null>(null);

//   const processResults = useCallback((results: Results) => {
//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//       const landmarks = results.multiHandLandmarks[0];
      
//       // Get wrist and middle finger tip positions
//       const wrist = landmarks[0];
//       const middleFingerTip = landmarks[12];
      
//       // Calculate horizontal movement
//       const deltaX = middleFingerTip.x - wrist.x;
//       const threshold = 0.1;
      
//       let direction: 'left' | 'right' | 'center' = 'center';
//       let confidence = Math.abs(deltaX);
      
//       if (deltaX < -threshold) {
//         direction = 'left';
//       } else if (deltaX > threshold) {
//         direction = 'right';
//       }
      
//       setGesture({
//         direction,
//         confidence: Math.min(confidence * 5, 1), // Normalize confidence
//         landmarks
//       });
//     } else {
//       setGesture({ direction: null, confidence: 0 });
//     }
//   }, []);

//   useEffect(() => {
//     if (!videoRef.current) return;

//     const initializeHands = async () => {
//       try {
//         const hands = new Hands({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
//         });

//         hands.setOptions({
//           maxNumHands: 1,
//           modelComplexity: 1,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5
//         });

//         hands.onResults(processResults);
//         handsRef.current = hands;

//         const camera = new Camera(videoRef.current!, {
//           onFrame: async () => {
//             if (handsRef.current && videoRef.current) {
//               await handsRef.current.send({ image: videoRef.current });
//             }
//           },
//           width: 640,
//           height: 480
//         });

//         cameraRef.current = camera;
//         await camera.start();
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Failed to initialize hand detection:', err);
//         setError('Failed to access camera or initialize hand detection');
//         setIsLoading(false);
//       }
//     };

//     initializeHands();

//     return () => {
//       if (cameraRef.current) {
//         cameraRef.current.stop();
//       }
//     };
//   }, [processResults, videoRef]);

//   return { gesture, isLoading, error };
// };

import { useEffect, useRef, useState, useCallback } from 'react';
// ✅ MODIFIED: Ensure correct imports from tasks-vision
import { HandLandmarker, FilesetResolver, HandLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { HandGesture } from '../types/game';


export const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [gesture, setGesture] = useState<HandGesture>({ direction: null, confidence: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // ✅ MODIFIED: Added debug log for result visibility
  const detectHands = useCallback(async () => {
    if (!videoRef.current || !landmarkerRef.current) return;

    const results: HandLandmarkerResult = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    console.log("Detection results:", results); // ✅ DEBUGGING LINE

    if (results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      const wrist = landmarks[0];
      const middleTip = landmarks[12];
      const deltaX = middleTip.x - wrist.x;
      const threshold = 0.1;

      let direction: 'left' | 'right' | 'center' = 'center';
      let confidence = Math.abs(deltaX);

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
    }

    animationFrameId.current = requestAnimationFrame(detectHands);
  }, []);

  const drawLandmarks = (landmarks: NormalizedLandmark[]) => {
  const canvas = document.getElementById('landmark-canvas') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas || !videoRef.current) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00FFFF';

  landmarks.forEach((landmark) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
};


 useEffect(() => {
  const setup = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      // ✅ GPU with fallback to CPU
      let handLandmarker: HandLandmarker;
      try {
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      } catch (gpuError) {
        console.warn('GPU initialization failed, falling back to CPU...', gpuError);

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      }

      landmarkerRef.current = handLandmarker;

      if (videoRef.current) {
        const waitForPlay = () => {
          if (videoRef.current && videoRef.current.readyState >= 3) {
            detectHands();
          } else {
            setTimeout(waitForPlay, 100);
          }
        };
        waitForPlay();
      }

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
