import React, { useEffect, useState } from 'react';
import { Play, Pause, X, Plus, Minus, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface RestTimerOverlayProps {
  durationSeconds: number;
  soundEnabled: boolean;
  onClose: () => void;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  durationSeconds,
  soundEnabled,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const total = durationSeconds;

  useEffect(() => {
    setTimeLeft(durationSeconds);
    setIsRunning(true);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      if (soundEnabled) soundManager.playRestComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (soundEnabled && next <= 3 && next > 0) {
          soundManager.playTick();
        } else if (soundEnabled && next === 0) {
          soundManager.playRestComplete();
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, soundEnabled]);

  const addTime = (secs: number) => {
    setTimeLeft(prev => Math.max(0, prev + secs));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = total > 0 ? ((total - timeLeft) / total) * 100 : 100;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md rounded-2xl shadow-2xl p-4 z-40 transition-all animate-in fade-in slide-in-from-bottom-4">
      {/* Top progress indicator */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft === 0 ? 'bg-emerald-400' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Recupero Tra Serie
          </span>
          <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            {timeLeft === 0 && (
              <span className="ml-2 text-sm text-emerald-400 font-sans font-normal animate-pulse">
                Vai col prossimo set! 💪
              </span>
            )}
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addTime(-15)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold active:scale-95 transition"
            title="-15s"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => addTime(30)}
            className="px-2.5 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold active:scale-95 transition"
            title="+30s"
          >
            +30s
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold active:scale-95 transition shadow-lg shadow-emerald-500/20"
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
