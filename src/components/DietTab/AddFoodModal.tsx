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

  // Selected from favorites adjustment
  const [selectedFood, setSelectedFood] = useState<SavedFood | null>(null);
  const [customPortionGram, setCustomPortionGram] = useState<string>('');

  const filteredSavedFoods = savedFoods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">
              Aggiungi a {MEAL_NAMES[mealType]}
            </h3>
            <p className="text-xs text-slate-400">Registra cosa hai mangiato</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition ${
              activeTab === 'favorites'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Alimenti Frequenti ({savedFoods.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            + Alimento Personalizzato
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'favorites' ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cerca alimento (pollo, riso, uova, pasta)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredSavedFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFavorite(food)}
                    className="w-full p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl flex items-center justify-between text-left group active:scale-98 transition"
                  >
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
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
                    <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition">
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </div>
                  </button>
                ))}

                {filteredSavedFoods.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400">Nessun alimento trovato.</p>
                    <button
                      onClick={() => {
                        setName(search);
                        setActiveTab('custom');
                      }}
                      className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
                    >
                      Aggiungilo ora come nuovo alimento
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddCustom} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Nome Alimento o Piatto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Salmone con patate al forno"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Porzione / Quantità (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. 200g, 1 piatto, 1 porzione"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-emerald-400 block mb-1">
                    Calorie (kcal) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="Es. 450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-sky-400 block mb-1">
                    Proteine (g)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-amber-400 block mb-1">
                    Carboidrati (g)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-rose-400 block mb-1">
                    Grassi (g)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToFavorites}
                  onChange={(e) => setSaveToFavorites(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  Salva nei preferiti per riusarlo velocemente in futuro
                </span>
              </label>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
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
