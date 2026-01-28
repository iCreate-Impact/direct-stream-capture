import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { CapturePreview } from '@/components/CapturePreview';
import { useMotionCapture } from '@/hooks/useMotionCapture';

const Index = () => {
  const {
    state,
    settings,
    setSettings,
    videoRef,
    canvasRef,
    outputCanvasRef,
    startCapture,
    stopCapture,
  } = useMotionCapture();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />

      <main className="flex-1 flex min-h-0 p-4 gap-4">
        {/* Left Sidebar - Controls */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-72 flex-shrink-0 overflow-y-auto"
        >
          <ControlPanel
            state={state}
            settings={settings}
            onSettingsChange={setSettings}
            onStart={startCapture}
            onStop={stopCapture}
          />
        </motion.aside>

        {/* Main Content - Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <CapturePreview
            state={state}
            videoRef={videoRef}
            canvasRef={canvasRef}
            outputCanvasRef={outputCanvasRef}
            onStart={startCapture}
          />
        </motion.div>

        {/* Right Sidebar - Info */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-64 flex-shrink-0 overflow-y-auto"
        >
          <div className="panel">
            <div className="panel-header">How It Works</div>
            <div className="p-4 text-sm space-y-3 text-muted-foreground">
              <p>
                <span className="text-primary font-medium">MotionExtract</span> captures
                your screen and isolates only the moving pixels using frame differencing.
              </p>
              <p>
                Adjust the <span className="text-foreground">sensitivity</span> to control
                how much motion is detected. Higher values catch subtle movements.
              </p>
              <p>
                Enable <span className="text-foreground">Motion Only Mode</span> to see
                pure motion data—perfect for analyzing movement patterns.
              </p>
            </div>
          </div>

          <div className="panel mt-4">
            <div className="panel-header">Tips</div>
            <div className="p-4 space-y-2">
              <div className="flex gap-2 text-xs">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">
                  Select the specific window you want to capture
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">
                  Lower sensitivity for games with subtle effects
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">
                  Use colored highlights to track specific motion types
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      </main>
    </div>
  );
};

export default Index;
