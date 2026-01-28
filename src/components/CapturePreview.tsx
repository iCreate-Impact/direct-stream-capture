import { RefObject } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Scan } from 'lucide-react';
import { CaptureState } from '@/hooks/useMotionCapture';

interface CapturePreviewProps {
  state: CaptureState;
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  outputCanvasRef: RefObject<HTMLCanvasElement>;
  onStart: () => void;
}

export function CapturePreview({
  state,
  videoRef,
  canvasRef,
  outputCanvasRef,
  onStart,
}: CapturePreviewProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Main Output */}
      <div className="panel flex-1 flex flex-col min-h-0">
        <div className="panel-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-3.5 h-3.5" />
            <span>Motion Output</span>
          </div>
          {state.isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-glow-success"
            >
              <span className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
              <span className="text-xs">LIVE</span>
            </motion.div>
          )}
        </div>
        <div className="flex-1 relative bg-black/50 rounded-b-lg overflow-hidden min-h-0">
          {!state.isCapturing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div className="p-6 rounded-full bg-surface-2 border border-border">
                <Monitor className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">No Capture Active</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a window or screen to begin motion capture
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onStart}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium glow-primary"
                >
                  Start Capture
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <canvas
              ref={outputCanvasRef}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Source Preview (smaller) */}
      <div className="panel h-32 flex flex-col">
        <div className="panel-header flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5" />
          <span>Source</span>
        </div>
        <div className="flex-1 relative bg-black/50 rounded-b-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
