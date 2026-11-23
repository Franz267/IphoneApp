import React, { useState, useEffect } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  X,
  ChevronDown,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ExerciseDefinition,
  MuscleCategory,
  WorkoutExercise,
  WorkoutSession,
  WorkoutSet
} from '../../types';
import { soundManager } from '../../utils/audio';
import { RestTimerOverlay } from './RestTimerOverlay';

interface ActiveWorkoutModalProps {
  workout: WorkoutSession;
  exercisesLibrary: ExerciseDefinition[];
  soundEnabled: boolean;
  defaultRestSeconds: number;
  onUpdateWorkout: (workout: WorkoutSession) => void;
  onFinishWorkout: (workout: WorkoutSession) => void;
  onCancelWorkout: () => void;
  onAddNewExerciseToLibrary: (name: string, category: MuscleCategory) => ExerciseDefinition;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workout,
  exercisesLibrary,
  soundEnabled,
  defaultRestSeconds,
  onUpdateWorkout,
  onFinishWorkout,
  onCancelWorkout,
  onAddNewExerciseToLibrary
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    return Math.floor((Date.now() - workout.startTime) / 1000);
  });
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [newExerciseCategory, setNewExerciseCategory] = useState<MuscleCategory>('petto');
  const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - workout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [workout.startTime]);

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {
      // Ignore
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddSet = (exerciseId: string) => {
    triggerHaptic(12);
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSet = {
        id: 'set_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : 20,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    });

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
      durationSeconds: elapsedSeconds
    });
  };

  const handleToggleSetCompleted = (exerciseId: string, setId: string) => {
    let nowCompleted = false;
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const updatedSets = ex.sets.map(s => {
        if (s.id === setId) {
          nowCompleted = !s.completed;
          return { ...s, completed: nowCompleted };
        }
        return s;
      });
      return { ...ex, sets: updatedSets };
    });

    if (nowCompleted) {
      triggerHaptic(20);
      if (soundEnabled) soundManager.playCheck();
      setActiveRestTimer(defaultRestSeconds);
    } else {
      triggerHaptic(8);
    }

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
      durationSeconds: elapsedSeconds
    });
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => (s.id === setId ? { ...s, [field]: value } : s))
      };
    });

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
      durationSeconds: elapsedSeconds
    });
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    triggerHaptic(8);
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const filtered = ex.sets.filter(s => s.id !== setId);
      const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      return { ...ex, sets: renumbered };
    });

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
      durationSeconds: elapsedSeconds
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (confirm('Vuoi rimuovere questo esercizio dalla sessione?')) {
      triggerHaptic(15);
      const updatedExercises = workout.exercises.filter(ex => ex.id !== exerciseId);
      onUpdateWorkout({
        ...workout,
        exercises: updatedExercises,
        durationSeconds: elapsedSeconds
      });
    }
  };

  const handleSelectExercise = (exDef: ExerciseDefinition) => {
    triggerHaptic(12);
    const newEx: WorkoutExercise = {
      id: 'we_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      exerciseId: exDef.id,
      name: exDef.name,
      category: exDef.category,
      sets: [
        {
          id: 'set_' + Date.now(),
          setNumber: 1,
          weight: 20,
          reps: 10,
          completed: false
        }
      ]
    };

    onUpdateWorkout({
      ...workout,
      exercises: [...workout.exercises, newEx],
      durationSeconds: elapsedSeconds
    });
    setShowAddExerciseModal(false);
  };

  const handleFinish = () => {
    let volume = 0;
    workout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          volume += (s.weight || 0) * (s.reps || 0);
        }
      });
    });

    triggerHaptic(35);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    if (soundEnabled) {
      soundManager.playWorkoutFinished();
    }

    onFinishWorkout({
      ...workout,
      completed: true,
      endTime: Date.now(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: Math.round(volume)
    });
  };

  const filteredLibrary = exercisesLibrary.filter(ex =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col overflow-hidden">
      {/* iOS Top sticky bar with Safe Area */}
      <div className="ios-glass border-b border-slate-800/80 px-4 pt-[calc(env(safe-area-inset-top,0px)+0.65rem)] pb-3 flex items-center justify-between">
        <div className="flex-1 mr-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <input
              type="text"
              value={workout.title}
              onChange={e => onUpdateWorkout({ ...workout, title: e.target.value })}
              className="bg-transparent font-extrabold text-[17px] text-white outline-none w-full border-b border-transparent focus:border-emerald-500 transition-colors"
              placeholder="Nome Allenamento"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancelWorkout}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-850 active:scale-95 transition"
          >
            Annulla
          </button>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Termina</span>
          </button>
        </div>
      </div>

      {/* Main workout scroll area with iOS momentum */}
      <div className="flex-1 overflow-y-auto ios-scroll p-4 space-y-4 pb-[calc(env(safe-area-inset-bottom,0px)+6rem)]">
        {workout.exercises.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">Nessun esercizio ancora inserito</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Aggiungi il tuo primo esercizio per iniziare a registrare pesi e ripetizioni!
            </p>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Esercizio</span>
            </button>
          </div>
        ) : (
          workout.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="ios-glass-card rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-extrabold text-[16px] text-white tracking-tight">{exercise.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-emerald-400 mt-0.5 inline-block">
                    {exercise.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-slate-800 active:scale-90 transition"
                    title="Rimuovi esercizio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sets Table Header */}
              <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                <span className="col-span-2 text-center">Set</span>
                <span className="col-span-4 text-center">KG</span>
                <span className="col-span-4 text-center">Reps</span>
                <span className="col-span-2 text-center">Fatto</span>
              </div>

              {/* Sets Rows */}
              <div className="space-y-2">
                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl transition ${
                      set.completed
                        ? 'bg-emerald-950/30 border border-emerald-500/40'
                        : 'bg-slate-900/60 border border-slate-800/80'
                    }`}
                  >
                    {/* Set number */}
                    <div className="col-span-2 flex items-center justify-center font-bold text-xs text-slate-400 font-mono">
                      {set.setNumber}
                    </div>

                    {/* Weight Input (font size 16px to prevent iOS auto-zoom) */}
                    <div className="col-span-4 flex items-center bg-slate-950 rounded-xl border border-slate-700/80 overflow-hidden px-1.5">
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        min="0"
                        value={set.weight === 0 ? '' : set.weight}
                        placeholder="0"
                        onChange={(e) =>
                          handleUpdateSet(
                            exercise.id,
                            set.id,
                            'weight',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full text-center py-2 font-bold text-[16px] text-white bg-transparent outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold mr-1">kg</span>
                    </div>

                    {/* Reps Input (font size 16px to prevent iOS auto-zoom) */}
                    <div className="col-span-4 flex items-center bg-slate-950 rounded-xl border border-slate-700/80 overflow-hidden px-1.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={set.reps === 0 ? '' : set.reps}
                        placeholder="0"
                        onChange={(e) =>
                          handleUpdateSet(
                            exercise.id,
                            set.id,
                            'reps',
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className="w-full text-center py-2 font-bold text-[16px] text-white bg-transparent outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold mr-1">rp</span>
                    </div>

                    {/* Complete checkmark with large tap target */}
                    <div className="col-span-2 flex items-center justify-center">
                      <button
                        onClick={() => handleToggleSetCompleted(exercise.id, set.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90 ${
                          set.completed
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-200'
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add set button */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleAddSet(exercise.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 py-1.5 px-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi Serie</span>
                </button>

                {exercise.sets.length > 1 && (
                  <button
                    onClick={() =>
                      handleRemoveSet(exercise.id, exercise.sets[exercise.sets.length - 1].id)
                    }
                    className="text-xs text-slate-500 hover:text-slate-400 py-1 px-2 active:scale-95 transition"
                  >
                    Rimuovi ultima
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {workout.exercises.length > 0 && (
          <button
            onClick={() => setShowAddExerciseModal(true)}
            className="w-full py-4 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Aggiungi Altro Esercizio</span>
          </button>
        )}
      </div>

      {/* Floating Rest Timer */}
      {activeRestTimer !== null && (
        <RestTimerOverlay
          durationSeconds={activeRestTimer}
          soundEnabled={soundEnabled}
          onClose={() => setActiveRestTimer(null)}
        />
      )}

      {/* Exercise Picker Modal - iOS Native Sheet */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
            {/* iOS Sheet drag handle */}
            <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto my-2.5" />

            <div className="px-4 pb-3 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-white">Scegli Esercizio</h3>
                <p className="text-xs text-slate-400">Seleziona dalla libreria o creane uno</p>
              </div>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800">
              <input
                type="text"
                placeholder="Cerca (Panca, Squat, Trazioni)..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-[16px] text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto ios-scroll p-4 space-y-2">
              {filteredLibrary.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between active:scale-[0.98] transition"
                >
                  <div>
                    <div className="font-bold text-sm text-white">
                      {ex.name}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      {ex.category}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-400" />
                </button>
              ))}

              {filteredLibrary.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-400 mb-3">
                    Nessun esercizio trovato per "{exerciseSearch}"
                  </p>
                  <button
                    onClick={() => {
                      if (!exerciseSearch.trim()) return;
                      const created = onAddNewExerciseToLibrary(
                        exerciseSearch.trim(),
                        newExerciseCategory
                      );
                      handleSelectExercise(created);
                    }}
                    className="py-2.5 px-4 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg active:scale-95 transition"
                  >
                    Crea "{exerciseSearch}" e aggiungi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
