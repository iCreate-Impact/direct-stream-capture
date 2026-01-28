import { motion } from 'framer-motion';
import { Zap, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="h-12 border-b border-border bg-surface-1 flex items-center justify-between px-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-sm leading-none">MotionExtract</h1>
          <p className="text-xs text-muted-foreground">Raw motion capture</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono px-2 py-1 rounded bg-surface-2 text-muted-foreground border border-border">
          v0.1.0-alpha
        </span>
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted-foreground hover:text-foreground"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
