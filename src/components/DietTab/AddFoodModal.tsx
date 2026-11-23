import React, { useState } from 'react';
import { X, Search, Plus, Sparkles, Check } from 'lucide-react';
import { FoodItem, MealType, SavedFood } from '../../types';

interface AddFoodModalProps {
  mealType: MealType;
  savedFoods: SavedFood[];
  onAddFood: (mealType: MealType, food: FoodItem, saveToFavorites?: boolean) => void;
  onClose: () => void;
}

const MEAL_NAMES: Record<MealType, string> = {
  breakfast: 'Colazione',
  lunch: 'Pranzo',
  dinner: 'Cena',
  snack: 'Spuntino'
};

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  mealType,
  savedFoods,
  onAddFood,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'custom'>('favorites');
  const [search, setSearch] = useState<string>('');

  // Custom food inputs
  const [name, setName] = useState<string>('');
  const [portion, setPortion] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [saveToFavorites, setSaveToFavorites] = useState<boolean>(true);

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {}
  };

  const filteredSavedFoods = savedFoods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    triggerHaptic(15);
    const food: FoodItem = {
      id: 'food_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      portion: portion.trim() || '1 porzione',
      calories: Math.round(parseFloat(calories) || 0),
      protein: Math.round((parseFloat(protein) || 0) * 10) / 10,
      carbs: Math.round((parseFloat(carbs) || 0) * 10) / 10,
      fat: Math.round((parseFloat(fat) || 0) * 10) / 10
    };

    onAddFood(mealType, food, saveToFavorites);
    onClose();
  };

  const handleSelectFavorite = (saved: SavedFood) => {
    triggerHaptic(15);
    const food: FoodItem = {
      id: 'food_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: saved.name,
      portion: saved.defaultPortion,
      calories: saved.calories,
      protein: saved.protein,
      carbs: saved.carbs,
      fat: saved.fat
    };
    onAddFood(mealType, food, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end">
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-[28px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto my-2.5" />

        {/* Header */}
        <div className="px-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[17px] text-white tracking-tight">
              Aggiungi a {MEAL_NAMES[mealType]}
            </h3>
            <p className="text-xs text-slate-400">Registra cosa hai mangiato</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Control iOS Tab */}
        <div className="p-3">
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => { triggerHaptic(8); setActiveTab('favorites'); }}
              className={`py-2 text-xs font-bold rounded-lg transition active:scale-95 ${
                activeTab === 'favorites'
                  ? 'bg-slate-850 text-white shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              Frequenti ({savedFoods.length})
            </button>
            <button
              onClick={() => { triggerHaptic(8); setActiveTab('custom'); }}
              className={`py-2 text-xs font-bold rounded-lg transition active:scale-95 ${
                activeTab === 'custom'
                  ? 'bg-slate-850 text-white shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              + Nuovo Alimento
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto ios-scroll px-4 pb-4">
          {activeTab === 'favorites' ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cerca alimento (pollo, riso, uova)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto ios-scroll pr-1">
                {filteredSavedFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFavorite(food)}
                    className="w-full p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center justify-between text-left active:scale-[0.98] transition"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">
                        {food.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="text-slate-300 font-semibold">{food.defaultPortion}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{food.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                        <span>P: <strong className="text-slate-300">{food.protein}g</strong></span>
                        <span>C: <strong className="text-slate-300">{food.carbs}g</strong></span>
                        <span>F: <strong className="text-slate-300">{food.fat}g</strong></span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddCustom} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Nome Alimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Pasta con salmone"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Porzione / Quantità (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. 150g, 1 piatto"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-400 block mb-1">
                    Calorie (kcal) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="0"
                    required
                    placeholder="450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-sky-400 block mb-1">
                    Proteine (g)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-400 block mb-1">
                    Carboidrati (g)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-rose-400 block mb-1">
                    Grassi (g)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToFavorites}
                  onChange={(e) => setSaveToFavorites(e.target.checked)}
                  className="rounded text-emerald-500 bg-slate-950 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  Salva nei preferiti per riusarlo velocemente
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                >
                  Aggiungi Pasto
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
