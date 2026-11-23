import React, { useState } from 'react';
import {
  Play,
  Plus,
  Dumbbell,
  Clock,
  ChevronRight,
  Edit2,
  Trash2,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import {
  ExerciseDefinition,
  MuscleCategory,
  WorkoutRoutine,
  WorkoutSession
} from '../../types';
import { WORKOUT_GUIDELINES } from '../../utils/defaults';
import { RoutineManagerModal } from './RoutineManagerModal';

interface WorkoutTabProps {
  activeWorkout: WorkoutSession | null;
  routines: WorkoutRoutine[];
  exercisesLibrary: ExerciseDefinition[];
  completedSessions: WorkoutSession[];
  onStartFreeWorkout: () => void;
  onStartRoutineWorkout: (routine: WorkoutRoutine) => void;
  onResumeWorkout: () => void;
  onSaveRoutine: (routine: WorkoutRoutine) => void;
  onDeleteRoutine: (id: string) => void;
  onAddNewExercise: (name: string, category: MuscleCategory) => ExerciseDefinition;
  onViewHistory: () => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  activeWorkout,
  routines,
  exercisesLibrary,
  completedSessions,
  onStartFreeWorkout,
  onStartRoutineWorkout,
  onResumeWorkout,
  onSaveRoutine,
  onDeleteRoutine,
  onViewHistory
}) => {
  const [editingRoutine, setEditingRoutine] = useState<WorkoutRoutine | null | 'new'>(null);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {}
  };

  const totalWorkouts = completedSessions.length;
  const recentWorkouts = completedSessions.slice(0, 3);

  return (
    <div className="space-y-4 pb-28">
      {/* Active Workout Resume Card (if any ongoing) */}
      {activeWorkout && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl shadow-emerald-950/40 text-slate-950 relative overflow-hidden animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-emerald-400 px-2.5 py-1 rounded-full">
                In Corso Adesso
              </span>
              <h3 className="text-xl font-black mt-2 text-white">{activeWorkout.title}</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {activeWorkout.exercises.length} esercizi in registrazione
              </p>
            </div>
            <button
              onClick={() => { triggerHaptic(15); onResumeWorkout(); }}
              className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-extrabold text-sm flex items-center gap-2 shadow-2xl active:scale-95 transition"
            >
              <span>Riprendi</span>
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Program Guidelines Card (Tutela Crociato & Progressione PDF) */}
      <div className="ios-glass-card rounded-2xl p-4 shadow-lg border border-emerald-500/30">
        <div
          onClick={() => { triggerHaptic(8); setShowGuidelines(!showGuidelines); }}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Scheda 3 Giorni • Tutela Crociato
              </h4>
              <p className="text-[11px] text-slate-400">
                Regole RIR 1-2, progressione e riscaldamento ginocchio
              </p>
            </div>
          </div>
          {showGuidelines ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {showGuidelines && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
            {WORKOUT_GUIDELINES.rules.map((rule, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="font-bold text-emerald-400 mb-0.5">{rule.title}</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">{rule.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Quick Action */}
      <div className="flex gap-3">
        <button
          onClick={() => { triggerHaptic(12); onStartFreeWorkout(); }}
          className="flex-1 p-4 rounded-3xl ios-glass-card hover:border-emerald-500/40 flex items-center justify-between group active:scale-[0.98] transition shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-white text-[16px]">Allenamento Libero</div>
              <div className="text-xs text-slate-400">Registra serie e carichi al volo</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
        </button>
      </div>

      {/* Routines / Schede Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-[17px] text-white tracking-tight">Le Tue Schede</h3>
          </div>
          <button
            onClick={() => { triggerHaptic(8); setEditingRoutine('new'); }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 active:scale-90 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuova Scheda</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="ios-glass-card rounded-2xl p-4 shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h4 className="font-extrabold text-[16px] text-white tracking-tight">{routine.name}</h4>
                  {routine.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {routine.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-emerald-400 font-bold">
                      {routine.exercises.length} esercizi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { triggerHaptic(8); setEditingRoutine(routine); }}
                    className="p-2 text-slate-400 hover:text-white rounded-xl active:scale-90 transition"
                    title="Modifica"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Eliminare la scheda "${routine.name}"?`)) {
                        triggerHaptic(12);
                        onDeleteRoutine(routine.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-xl active:scale-90 transition"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { triggerHaptic(15); onStartRoutineWorkout(routine); }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 active:scale-90 transition ml-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inizia</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts Widget */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-[17px] text-white tracking-tight">Ultimi Allenamenti</h3>
          </div>
          {totalWorkouts > 0 && (
            <button
              onClick={() => { triggerHaptic(8); onViewHistory(); }}
              className="text-xs font-bold text-slate-400 hover:text-emerald-400 active:scale-95 transition"
            >
              Vedi Tutti ({totalWorkouts})
            </button>
          )}
        </div>

        <div className="space-y-2">
          {recentWorkouts.map((sess) => {
            const dateFormatted = new Date(sess.date).toLocaleDateString('it-IT', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });
            return (
              <div
                key={sess.id}
                className="p-3.5 ios-glass-card rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-sm text-white">{sess.title}</div>
                  <div className="flex items-center gap-2.5 mt-0.5 text-xs text-slate-400">
                    <span>{dateFormatted}</span>
                    <span>•</span>
                    <span>{Math.round(sess.durationSeconds / 60)} min</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{sess.totalVolumeKg} kg</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 px-2.5 py-1 bg-slate-800/80 rounded-xl">
                  {sess.exercises.length} es.
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Manager Modal */}
      {editingRoutine && (
        <RoutineManagerModal
          routineToEdit={editingRoutine === 'new' ? null : editingRoutine}
          exercisesLibrary={exercisesLibrary}
          onSave={onSaveRoutine}
          onClose={() => setEditingRoutine(null)}
        />
      )}
    </div>
  );
};
