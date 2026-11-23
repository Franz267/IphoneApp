import React from 'react';
import { Dumbbell, Utensils, History, Settings } from 'lucide-react';

export type TabType = 'workout' | 'diet' | 'history' | 'settings';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  hasActiveWorkout: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  hasActiveWorkout,
}) => {
  const tabs = [
    { id: 'workout' as TabType, label: 'Palestra', icon: Dumbbell, hasBadge: hasActiveWorkout },
    { id: 'diet' as TabType, label: 'Dieta', icon: Utensils },
    { id: 'history' as TabType, label: 'Storico', icon: History },
    { id: 'settings' as TabType, label: 'Profilo', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)] pt-1.5 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(({ id, label, icon: Icon, hasBadge }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onChangeTab(id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition active:scale-90 ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
