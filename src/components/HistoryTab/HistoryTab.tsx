import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Dumbbell,
  Trophy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { WeightRecord, WorkoutSession } from '../../types';

interface HistoryTabProps {
  sessions: WorkoutSession[];
  weightRecords: WeightRecord[];
  onDeleteSession: (id: string) => void;
  onAddWeightRecord: (weight: number) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  sessions,
  weightRecords,
  onDeleteSession,
  onAddWeightRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'workouts' | 'prs' | 'weight'>('workouts');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [inputWeight, setInputWeight] = useState<string>('');

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {}
  };

  const personalRecords: Record<string, { maxWeight: number; reps: number; date: string }> = {};

  sessions.forEach((sess) => {
    sess.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && set.weight > 0) {
          const currentRecord = personalRecords[ex.name];
          if (!currentRecord || set.weight > currentRecord.maxWeight) {
            personalRecords[ex.name] = {
              maxWeight: set.weight,
              reps: set.reps,
              date: sess.date
            };
          }
        }
      });
    });
  });

  const prList = Object.entries(personalRecords).sort(
    (a, b) => b[1].maxWeight - a[1].maxWeight
  );

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (w > 20 && w < 300) {
      triggerHaptic(15);
      onAddWeightRecord(w);
      setInputWeight('');
    }
  };

  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1] : null;

  return (
    <div className="space-y-4 pb-28">
      {/* iOS Segmented Control */}
      <div className="grid grid-cols-3 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
        <button
          onClick={() => { triggerHaptic(8); setActiveSubTab('workouts'); }}
          className={`py-2 text-xs font-bold rounded-xl transition active:scale-95 ${
            activeSubTab === 'workouts'
              ? 'bg-slate-850 text-white shadow-md'
              : 'text-slate-400'
          }`}
        >
          Allenamenti ({sessions.length})
        </button>
        <button
          onClick={() => { triggerHaptic(8); setActiveSubTab('prs'); }}
          className={`py-2 text-xs font-bold rounded-xl transition active:scale-95 ${
            activeSubTab === 'prs'
              ? 'bg-slate-850 text-white shadow-md'
              : 'text-slate-400'
          }`}
        >
          Record (PR) 🏆
        </button>
        <button
          onClick={() => { triggerHaptic(8); setActiveSubTab('weight'); }}
          className={`py-2 text-xs font-bold rounded-xl transition active:scale-95 ${
            activeSubTab === 'weight'
              ? 'bg-slate-850 text-white shadow-md'
              : 'text-slate-400'
          }`}
        >
          Peso Corporeo
        </button>
      </div>

      {/* Subtab 1: Workouts History */}
      {activeSubTab === 'workouts' && (
        <div className="space-y-2.5">
          {sessions.map((sess) => {
            const isExpanded = expandedSessionId === sess.id;
            const formattedDate = new Date(sess.date).toLocaleDateString('it-IT', {
              weekday: 'short',
              day: 'numeric',
              month: 'long'
            });

            return (
              <div
                key={sess.id}
                className="ios-glass-card rounded-2xl overflow-hidden shadow-lg transition"
              >
                <div
                  onClick={() => {
                    triggerHaptic(8);
                    setExpandedSessionId(isExpanded ? null : sess.id);
                  }}
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-850 transition"
                >
                  <div>
                    <h4 className="font-extrabold text-[16px] text-white tracking-tight">{sess.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span>{Math.round(sess.durationSeconds / 60)} min</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{sess.totalVolumeKg} kg vol</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Eliminare la sessione "${sess.title}"?`)) {
                          triggerHaptic(12);
                          onDeleteSession(sess.id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-xl active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                    {sess.exercises.map((ex) => (
                      <div key={ex.id} className="pt-2">
                        <div className="font-bold text-xs text-slate-300">{ex.name}</div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {ex.sets.map((s) => (
                            <span
                              key={s.id}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-mono ${
                                s.completed
                                  ? 'bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold'
                                  : 'bg-slate-900/60 text-slate-500'
                              }`}
                            >
                              {s.weight}kg × {s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Nessun allenamento registrato</p>
              <p className="text-xs text-slate-500 mt-1">
                Completa il tuo primo workout dalla scheda Palestra per vederlo qui!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: PRs (Personal Records) */}
      {activeSubTab === 'prs' && (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Trophy className="w-4 h-4" />
              <span>I Tuoi Massimali Raggiunti</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calcolati automaticamente dai tuoi carichi più pesanti registrati negli allenamenti.
            </p>
          </div>

          <div className="space-y-2">
            {prList.map(([exName, record]) => (
              <div
                key={exName}
                className="p-3.5 ios-glass-card rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{exName}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {record.reps} ripetizioni • {new Date(record.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black font-mono text-emerald-400">
                    {record.maxWeight} kg
                  </div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Record</span>
                </div>
              </div>
            ))}

            {prList.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                Completa serie con carichi negli allenamenti per vedere qui i tuoi record!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: Bodyweight Tracking */}
      {activeSubTab === 'weight' && (
        <div className="space-y-3">
          <form
            onSubmit={handleSaveWeight}
            className="p-3.5 ios-glass-card rounded-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="30"
                max="300"
                placeholder="Es. 74.5 kg"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl active:scale-95 transition"
            >
              Registra
            </button>
          </form>

          {latestWeight && (
            <div className="p-4 ios-glass-card rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Ultimo peso registrato</span>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  {latestWeight.weightKg} kg
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(latestWeight.date).toLocaleDateString('it-IT')}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Storico Pesate ({weightRecords.length})
            </h4>
            {weightRecords.slice().reverse().map((r, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/70 border border-slate-800/60 rounded-xl flex items-center justify-between"
              >
                <span className="text-xs text-slate-300">
                  {new Date(r.date).toLocaleDateString('it-IT', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {r.weightKg} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
