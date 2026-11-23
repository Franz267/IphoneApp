import React, { useState } from 'react';
import {
  Play,
  Plus,
  Dumbbell,
  Clock,
  Flame,
  ChevronRight,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ExerciseDefinition,
  MuscleCategory,
  WorkoutExercise,
  WorkoutRoutine,
  WorkoutSession
} from '../../types';
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

  // Calculate quick stats
  const totalWorkouts = completedSessions.length;
  const recentWorkouts = completedSessions.slice(0, 3);

  return (
    <div className="space-y-6 pb-24">
      {/* Active Workout Resume Card (if any ongoing) */}
      {activeWorkout && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl shadow-emerald-900/30 text-slate-950 relative overflow-hidden animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-slate-950 text-emerald-400 px-2.5 py-1 rounded-full">
                In Corso Adesso
              </span>
              <h3 className="text-xl font-black mt-2 text-white">{activeWorkout.title}</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {activeWorkout.exercises.length} esercizi in registrazione
              </p>
            </div>
            <button
              onClick={onResumeWorkout}
              className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-extrabold text-sm flex items-center gap-2 shadow-2xl active:scale-95 transition"
            >
              <span>Riprendi</span>
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Quick Action */}
      <div className="flex gap-3">
        <button
          onClick={onStartFreeWorkout}
          className="flex-1 p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between group active:scale-98 transition shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-white text-base">Allenamento Libero</div>
              <div className="text-xs text-slate-400">Registra serie al volo</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
        </button>
      </div>

      {/* Routines / Schede Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Le Tue Schede</h3>
          </div>
          <button
            onClick={() => setEditingRoutine('new')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuova Scheda</span>
          </button>
        </div>

        <div className="space-y-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h4 className="font-bold text-base text-white">{routine.name}</h4>
                  {routine.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {routine.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                      {routine.exercises.length} esercizi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingRoutine(routine)}
                    className="p-2 text-slate-500 hover:text-slate-300 rounded-xl hover:bg-slate-800 transition"
                    title="Modifica"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Eliminare la scheda "${routine.name}"?`)) {
                        onDeleteRoutine(routine.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStartRoutineWorkout(routine)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition ml-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inizia</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {routines.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Nessuna scheda creata</p>
              <p className="text-xs text-slate-500 mt-1">
                Crea una scheda personalizzata con i tuoi esercizi preferiti.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Workouts Widget */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Ultimi Allenamenti</h3>
          </div>
          {totalWorkouts > 0 && (
            <button
              onClick={onViewHistory}
              className="text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
            >
              Vedi Tutti ({totalWorkouts})
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {recentWorkouts.map((sess) => {
            const dateFormatted = new Date(sess.date).toLocaleDateString('it-IT', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });
            return (
              <div
                key={sess.id}
                className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white">{sess.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>{dateFormatted}</span>
                    <span>•</span>
                    <span>{Math.round(sess.durationSeconds / 60)} min</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{sess.totalVolumeKg} kg vol.</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-800/80 rounded-lg">
                  {sess.exercises.length} es.
                </div>
              </div>
            );
          })}

          {recentWorkouts.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/60">
              Nessun allenamento completato ancora. Fai il tuo primo workout oggi!
            </div>
          )}
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
