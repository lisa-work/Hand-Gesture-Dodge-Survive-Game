import React, { useRef, useEffect } from 'react';
import { HandGesture } from '../types/game';
import { Camera, ArrowLeft, ArrowRight, Circle } from 'lucide-react';

interface CameraFeedProps {
  gesture: HandGesture;
  isLoading: boolean;
  error: string | null;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ gesture, isLoading, error }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const getGestureIcon = () => {
    switch (gesture.direction) {
      case 'left':
        return <ArrowLeft className="w-6 h-6 text-cyan-400" />;
      case 'right':
        return <ArrowRight className="w-6 h-6 text-cyan-400" />;
      case 'center':
        return <Circle className="w-6 h-6 text-green-400" />;
      default:
        return <Camera className="w-6 h-6 text-gray-400" />;
    }
  };

  const getGestureText = () => {
    switch (gesture.direction) {
      case 'left':
        return 'Moving Left';
      case 'right':
        return 'Moving Right';
      case 'center':
        return 'Centered';
      default:
        return 'No Hand Detected';
    }
  };

  if (error) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-900/80 backdrop-blur-sm border border-red-500 rounded-lg p-4 max-w-xs">
        <div className="text-red-400 text-sm font-medium">Camera Error</div>
        <div className="text-red-300 text-xs mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm border border-cyan-400 rounded-lg overflow-hidden shadow-2xl">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-48 h-36 object-cover"
          style={{ transform: 'scaleX(-1)' }}
          onLoadedMetadata={() => {
            const canvas = document.getElementById('landmark-canvas') as HTMLCanvasElement;
            if (canvas && videoRef.current) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
            }
          }}
        />

        {/* ✅ Canvas overlay for landmarks */}
        <canvas
          id="landmark-canvas"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/75 flex items-center justify-center">
            <div className="text-cyan-400 text-sm">Loading Camera...</div>
          </div>
        )}

        {/* Gesture Overlay */}
        <div className="absolute top-2 left-2 right-2 bg-black/60 rounded px-2 py-1">
          <div className="flex items-center space-x-2">
            {getGestureIcon()}
            <span className="text-white text-xs font-medium">{getGestureText()}</span>
          </div>
          
          {gesture.confidence > 0 && (
            <div className="mt-1">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-cyan-400 h-1 rounded-full transition-all duration-200"
                  style={{ width: `${gesture.confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};