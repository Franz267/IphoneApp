import React from 'react';
import { Dumbbell, WifiOff } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workout' | 'diet' | 'history' | 'settings';
  hasActiveWorkout: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, hasActiveWorkout }) => {
  return (
    <header className="sticky top-0 z-30 ios-glass border-b border-slate-800/80 shadow-xl transition-all">
      {/* Physical iOS Status Bar Spacer: guarantees zero overlap with clock, battery, or Dynamic Island */}
      <div
        className="w-full select-none pointer-events-none"
        style={{
          height: 'max(env(safe-area-inset-top, 0px), 50px)',
          minHeight: '50px'
        }}
      />

      <div className="px-4 pb-3 pt-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-transform">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-[17px] tracking-tight text-white flex items-center gap-1.5 font-sans">
              FitPulse
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                PWA
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveWorkout && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          )}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300"
            title="Tutti i dati sono salvati solo sul tuo iPhone"
          >
            <WifiOff className="w-3 h-3 text-emerald-400" />
            <span>100% Offline</span>
          </div>
        </div>
      </div>
    </header>
  );
};
