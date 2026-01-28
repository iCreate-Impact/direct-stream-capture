import { useState, useRef, useCallback, useEffect } from 'react';

export interface CaptureState {
  isCapturing: boolean;
  isProcessing: boolean;
  fps: number;
  resolution: { width: number; height: number } | null;
}

export interface MotionSettings {
  threshold: number; // 0-255, sensitivity for motion detection
  showMotionOnly: boolean; // Show only the delta/motion
  highlightColor: [number, number, number]; // RGB for motion highlight
  blurAmount: number; // Blur the static parts
}

export function useMotionCapture() {
  const [state, setState] = useState<CaptureState>({
    isCapturing: false,
    isProcessing: false,
    fps: 0,
    resolution: null,
  });

  const [settings, setSettings] = useState<MotionSettings>({
    threshold: 25,
    showMotionOnly: false,
    highlightColor: [0, 229, 255], // Cyan
    blurAmount: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 60, max: 60 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const track = stream.getVideoTracks()[0];
        const trackSettings = track.getSettings();

        setState((prev) => ({
          ...prev,
          isCapturing: true,
          resolution: {
            width: trackSettings.width || 1920,
            height: trackSettings.height || 1080,
          },
        }));

        // Handle stream ending
        track.onended = () => {
          stopCapture();
        };
      }
    } catch (error) {
      console.error('Failed to start capture:', error);
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    previousFrameRef.current = null;

    setState({
      isCapturing: false,
      isProcessing: false,
      fps: 0,
      resolution: null,
    });
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const outputCanvas = outputCanvasRef.current;

    if (!video || !canvas || !outputCanvas || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const outputCtx = outputCanvas.getContext('2d');

    if (!ctx || !outputCtx) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Set canvas sizes
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      outputCanvas.width = video.videoWidth;
      outputCanvas.height = video.videoHeight;
    }

    // Draw current frame
    ctx.drawImage(video, 0, 0);
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (previousFrameRef.current) {
      const previousFrame = previousFrameRef.current;
      const outputData = outputCtx.createImageData(canvas.width, canvas.height);

      const { threshold, showMotionOnly, highlightColor } = settings;

      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const rDiff = Math.abs(currentFrame.data[i] - previousFrame.data[i]);
        const gDiff = Math.abs(currentFrame.data[i + 1] - previousFrame.data[i + 1]);
        const bDiff = Math.abs(currentFrame.data[i + 2] - previousFrame.data[i + 2]);

        const avgDiff = (rDiff + gDiff + bDiff) / 3;
        const isMotion = avgDiff > threshold;

        if (isMotion) {
          if (showMotionOnly) {
            // Show motion in highlight color
            outputData.data[i] = highlightColor[0];
            outputData.data[i + 1] = highlightColor[1];
            outputData.data[i + 2] = highlightColor[2];
            outputData.data[i + 3] = 255;
          } else {
            // Show current frame with motion highlight overlay
            const intensity = Math.min(255, avgDiff * 2);
            outputData.data[i] = Math.min(255, currentFrame.data[i] + (highlightColor[0] * intensity) / 255);
            outputData.data[i + 1] = Math.min(255, currentFrame.data[i + 1] + (highlightColor[1] * intensity) / 255);
            outputData.data[i + 2] = Math.min(255, currentFrame.data[i + 2] + (highlightColor[2] * intensity) / 255);
            outputData.data[i + 3] = 255;
          }
        } else {
          if (showMotionOnly) {
            // Black/transparent for non-motion
            outputData.data[i] = 0;
            outputData.data[i + 1] = 0;
            outputData.data[i + 2] = 0;
            outputData.data[i + 3] = 30; // Slight visibility
          } else {
            // Show original frame
            outputData.data[i] = currentFrame.data[i];
            outputData.data[i + 1] = currentFrame.data[i + 1];
            outputData.data[i + 2] = currentFrame.data[i + 2];
            outputData.data[i + 3] = 255;
          }
        }
      }

      outputCtx.putImageData(outputData, 0, 0);
    } else {
      // First frame, just show it
      outputCtx.drawImage(video, 0, 0);
    }

    // Store current frame for next comparison
    previousFrameRef.current = currentFrame;

    // FPS calculation
    frameCountRef.current++;
    const now = Date.now();
    if (now - lastFpsUpdateRef.current >= 1000) {
      setState((prev) => ({
        ...prev,
        fps: frameCountRef.current,
      }));
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = now;
    }

    animationRef.current = requestAnimationFrame(processFrame);
  }, [settings]);

  useEffect(() => {
    if (state.isCapturing) {
      setState((prev) => ({ ...prev, isProcessing: true }));
      animationRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isCapturing, processFrame]);

  return {
    state,
    settings,
    setSettings,
    videoRef,
    canvasRef,
    outputCanvasRef,
    startCapture,
    stopCapture,
  };
}
