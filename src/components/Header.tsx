import React from 'react';
import { Dumbbell, WifiOff, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workout' | 'diet' | 'history' | 'settings';
  hasActiveWorkout: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, hasActiveWorkout }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-slate-900 px-4 pt-3 pb-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
          <Dumbbell className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
            FitPulse
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">
              PWA
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasActiveWorkout && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Workout attivo
          </span>
        )}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-400"
          title="Tutti i dati sono salvati solo sul tuo dispositivo"
        >
          <WifiOff className="w-3 h-3 text-emerald-400" />
          <span>100% Locale</span>
        </div>
      </div>
    </header>
  );
};
