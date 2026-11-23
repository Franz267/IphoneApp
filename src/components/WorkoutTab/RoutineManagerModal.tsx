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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">
              {routineToEdit ? 'Modifica Scheda' : 'Nuova Scheda Allenamento'}
            </h3>
            <p className="text-xs text-slate-400">Personalizza la tua routine</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Nome Scheda *
            </label>
            <input
              type="text"
              placeholder="Es. Gambe & Spalle, Upper Body..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Descrizione o Obiettivo (opzionale)
            </label>
            <input
              type="text"
              placeholder="Es. Focus ipertrofia, recupero 90s..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Exercise list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400">
                Esercizi inclusi ({selectedExercises.length})
              </label>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline"
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
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white truncate">
                        {exDef ? exDef.name : item.exerciseId}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <label className="flex items-center gap-1">
                          <span>Set:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.targetSets}
                            onChange={(e) =>
                              handleUpdateExercise(
                                idx,
                                'targetSets',
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="w-12 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-white"
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
                            className="w-14 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-white"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {selectedExercises.length === 0 && (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  Nessun esercizio aggiunto. Clicca su "Aggiungi Esercizio" in alto.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="p-4 border-t border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            Salva Scheda
          </button>
        </div>

        {/* Quick Exercise Picker Sub-modal */}
        {pickerOpen && (
          <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col p-4 rounded-t-3xl sm:rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-sm text-white">Seleziona Esercizio</h4>
              <button
                onClick={() => setPickerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-1.5">
              {exercisesLibrary.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleAddExercise(ex.id)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs text-white border border-transparent hover:border-slate-700"
                >
                  <span className="font-semibold">{ex.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
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
