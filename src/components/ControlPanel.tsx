import { motion } from 'framer-motion';
import { Play, Square, Settings2, Eye, EyeOff, Gauge } from 'lucide-react';
import { CaptureState, MotionSettings } from '@/hooks/useMotionCapture';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ControlPanelProps {
  state: CaptureState;
  settings: MotionSettings;
  onSettingsChange: (settings: MotionSettings) => void;
  onStart: () => void;
  onStop: () => void;
}

export function ControlPanel({
  state,
  settings,
  onSettingsChange,
  onStart,
  onStop,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Controls */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5" />
          <span>Controls</span>
        </div>
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={state.isCapturing ? onStop : onStart}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              state.isCapturing
                ? 'bg-destructive text-destructive-foreground glow-danger'
                : 'bg-primary text-primary-foreground glow-primary'
            }`}
          >
            {state.isCapturing ? (
              <>
                <Square className="w-4 h-4" />
                Stop Capture
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Capture
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Status */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5" />
          <span>Status</span>
        </div>
        <div className="p-4 space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span
              className={`flex items-center gap-2 ${
                state.isCapturing ? 'text-glow-success' : 'text-muted-foreground'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  state.isCapturing ? 'bg-glow-success animate-pulse' : 'bg-muted-foreground'
                }`}
              />
              {state.isCapturing ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">FPS</span>
            <span className={state.fps > 0 ? 'text-primary text-glow' : ''}>
              {state.fps}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resolution</span>
            <span>
              {state.resolution
                ? `${state.resolution.width}×${state.resolution.height}`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Motion Settings */}
      <div className="panel">
        <div className="panel-header flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          <span>Motion Detection</span>
        </div>
        <div className="p-4 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Sensitivity</Label>
              <span className="font-mono text-muted-foreground">
                {255 - settings.threshold}
              </span>
            </div>
            <Slider
              value={[255 - settings.threshold]}
              min={0}
              max={255}
              step={1}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, threshold: 255 - value })
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {settings.showMotionOnly ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
              Motion Only Mode
            </Label>
            <Switch
              checked={settings.showMotionOnly}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, showMotionOnly: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Highlight Color</Label>
            <div className="flex gap-2">
              {[
                { color: [0, 229, 255], name: 'Cyan' },
                { color: [255, 64, 129], name: 'Pink' },
                { color: [0, 255, 136], name: 'Green' },
                { color: [255, 193, 7], name: 'Amber' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    onSettingsChange({
                      ...settings,
                      highlightColor: preset.color as [number, number, number],
                    })
                  }
                  className={`w-8 h-8 rounded-md border-2 transition-all ${
                    JSON.stringify(settings.highlightColor) ===
                    JSON.stringify(preset.color)
                      ? 'border-primary scale-110'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: `rgb(${preset.color.join(',')})`,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
