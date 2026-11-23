import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell } from 'lucide-react';
import { ExerciseDefinition, WorkoutRoutine } from '../../types';

interface RoutineManagerModalProps {
  routineToEdit?: WorkoutRoutine | null;
  exercisesLibrary: ExerciseDefinition[];
  onSave: (routine: WorkoutRoutine) => void;
  onClose: () => void;
}

export const RoutineManagerModal: React.FC<RoutineManagerModalProps> = ({
  routineToEdit,
  exercisesLibrary,
  onSave,
  onClose
}) => {
  const [name, setName] = useState<string>(routineToEdit?.name || '');
  const [description, setDescription] = useState<string>(routineToEdit?.description || '');
  const [selectedExercises, setSelectedExercises] = useState<
    { exerciseId: string; targetSets: number; targetReps: string; targetWeight?: number }[]
  >(routineToEdit?.exercises || []);

  const [pickerOpen, setPickerOpen] = useState(false);

  const handleAddExercise = (exerciseId: string) => {
    setSelectedExercises([
      ...selectedExercises,
      { exerciseId, targetSets: 3, targetReps: '10', targetWeight: 20 }
    ]);
    setPickerOpen(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (
    index: number,
    field: 'targetSets' | 'targetReps' | 'targetWeight',
    val: any
  ) => {
    setSelectedExercises(
      selectedExercises.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Inserisci un nome per la scheda (es. Push Day)');
      return;
    }
    const routine: WorkoutRoutine = {
      id: routineToEdit?.id || 'routine_' + Date.now(),
      name: name.trim(),
      description: description.trim(),
      exercises: selectedExercises
    };
    onSave(routine);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end">
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-[28px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto my-2.5" />

        <div className="px-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[17px] text-white">
              {routineToEdit ? 'Modifica Scheda' : 'Nuova Scheda Allenamento'}
            </h3>
            <p className="text-xs text-slate-400">Personalizza la tua routine</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto ios-scroll p-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Nome Scheda *
            </label>
            <input
              type="text"
              placeholder="Es. Gambe & Spalle, Upper Body..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-[16px] text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Descrizione o Obiettivo (opzionale)
            </label>
            <input
              type="text"
              placeholder="Es. Focus ipertrofia, recupero 90s..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-[16px] text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* Exercise list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400">
                Esercizi inclusi ({selectedExercises.length})
              </label>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="text-xs font-bold text-emerald-400 flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aggiungi Esercizio</span>
              </button>
            </div>

            <div className="space-y-2">
              {selectedExercises.map((item, idx) => {
                const exDef = exercisesLibrary.find((e) => e.id === item.exerciseId);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate">
                        {exDef ? exDef.name : item.exerciseId}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <label className="flex items-center gap-1">
                          <span>Set:</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            value={item.targetSets}
                            onChange={(e) =>
                              handleUpdateExercise(
                                idx,
                                'targetSets',
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="w-12 px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-[16px]"
                          />
                        </label>
                        <label className="flex items-center gap-1">
                          <span>Reps:</span>
                          <input
                            type="text"
                            value={item.targetReps}
                            onChange={(e) =>
                              handleUpdateExercise(idx, 'targetReps', e.target.value)
                            }
                            className="w-16 px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-[16px]"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-slate-800 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="px-4 pt-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm active:scale-95 transition"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          >
            Salva Scheda
          </button>
        </div>

        {/* Quick Exercise Picker Sub-modal */}
        {pickerOpen && (
          <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col p-4 rounded-t-[28px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-extrabold text-sm text-white">Seleziona Esercizio</h4>
              <button
                onClick={() => setPickerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto ios-scroll py-3 space-y-1.5">
              {exercisesLibrary.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleAddExercise(ex.id)}
                  className="w-full text-left p-3 rounded-2xl hover:bg-slate-800 flex items-center justify-between text-xs text-white border border-transparent hover:border-slate-700 active:scale-[0.98]"
                >
                  <span className="font-bold">{ex.name}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">
                    {ex.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
