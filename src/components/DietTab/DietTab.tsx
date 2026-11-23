import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Utensils,
  Coffee,
  Salad,
  Apple,
  Droplets,
  Flame
} from 'lucide-react';
import { DailyDietLog, FoodItem, MealType, SavedFood, UserProfile } from '../../types';
import { AddFoodModal } from './AddFoodModal';

interface DietTabProps {
  currentDate: string; // YYYY-MM-DD
  dietLog: DailyDietLog;
  profile: UserProfile;
  savedFoods: SavedFood[];
  onDateChange: (date: string) => void;
  onUpdateDietLog: (date: string, log: DailyDietLog) => void;
  onSaveNewFavoriteFood: (food: SavedFood) => void;
}

export const DietTab: React.FC<DietTabProps> = ({
  currentDate,
  dietLog,
  profile,
  savedFoods,
  onDateChange,
  onUpdateDietLog,
  onSaveNewFavoriteFood
}) => {
  const [modalMealType, setModalMealType] = useState<MealType | null>(null);

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {}
  };

  const shiftDate = (days: number) => {
    triggerHaptic(8);
    const current = new Date(currentDate);
    current.setDate(current.getDate() + days);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    onDateChange(`${yyyy}-${mm}-${dd}`);
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];

  const formatDateDisplay = (dateStr: string) => {
    const parts = dateStr.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateObj.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const allMeals = [
    ...(dietLog.meals.breakfast || []),
    ...(dietLog.meals.lunch || []),
    ...(dietLog.meals.dinner || []),
    ...(dietLog.meals.snack || [])
  ];

  const totalCalories = allMeals.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = Math.round(allMeals.reduce((sum, item) => sum + (item.protein || 0), 0));
  const totalCarbs = Math.round(allMeals.reduce((sum, item) => sum + (item.carbs || 0), 0));
  const totalFat = Math.round(allMeals.reduce((sum, item) => sum + (item.fat || 0), 0));

  const remainingCalories = profile.targetCalories - totalCalories;

  const handleAddFood = (mealType: MealType, food: FoodItem, saveToFavorites?: boolean) => {
    triggerHaptic(15);
    const currentList = dietLog.meals[mealType] || [];
    const updatedLog: DailyDietLog = {
      ...dietLog,
      meals: {
        ...dietLog.meals,
        [mealType]: [...currentList, food]
      }
    };
    onUpdateDietLog(currentDate, updatedLog);

    if (saveToFavorites) {
      const saved: SavedFood = {
        id: 'sf_' + Date.now(),
        name: food.name,
        defaultPortion: food.portion,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
      };
      onSaveNewFavoriteFood(saved);
    }
  };

  const handleRemoveFood = (mealType: MealType, foodId: string) => {
    triggerHaptic(10);
    const currentList = dietLog.meals[mealType] || [];
    const updatedLog: DailyDietLog = {
      ...dietLog,
      meals: {
        ...dietLog.meals,
        [mealType]: currentList.filter(f => f.id !== foodId)
      }
    };
    onUpdateDietLog(currentDate, updatedLog);
  };

  const handleAddWater = (ml: number) => {
    triggerHaptic(12);
    const newAmount = Math.max(0, (dietLog.waterMl || 0) + ml);
    onUpdateDietLog(currentDate, { ...dietLog, waterMl: newAmount });
  };

  const MEALS_CONFIG: { type: MealType; label: string; icon: any }[] = [
    { type: 'breakfast', label: 'Colazione', icon: Coffee },
    { type: 'lunch', label: 'Pranzo', icon: Salad },
    { type: 'dinner', label: 'Cena', icon: Utensils },
    { type: 'snack', label: 'Spuntini', icon: Apple }
  ];

  return (
    <div className="space-y-4 pb-28">
      {/* Date Navigation Header */}
      <div className="flex items-center justify-between ios-glass-card rounded-2xl p-2.5 shadow-lg">
        <button
          onClick={() => shiftDate(-1)}
          className="p-2 rounded-xl text-slate-400 hover:text-white active:scale-90 transition"
          title="Giorno precedente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="font-extrabold text-[16px] text-white capitalize tracking-tight">
            {isToday ? 'Oggi, ' : ''}
            {formatDateDisplay(currentDate)}
          </div>
          {!isToday && (
            <button
              onClick={() => { triggerHaptic(8); onDateChange(new Date().toISOString().split('T')[0]); }}
              className="text-[11px] font-bold text-emerald-400 hover:underline"
            >
              Torna a Oggi
            </button>
          )}
        </div>

        <button
          onClick={() => shiftDate(1)}
          className="p-2 rounded-xl text-slate-400 hover:text-white active:scale-90 transition"
          title="Giorno successivo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nutrition Card (iOS Health / Fitness Ring Style) */}
      <div className="ios-glass-card rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Calorie Giornaliere
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black font-mono text-white">
                {totalCalories}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {profile.targetCalories} kcal
              </span>
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 ${
              remainingCalories >= 0
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>
              {remainingCalories >= 0
                ? `${remainingCalories} kcal rimaste`
                : `${Math.abs(remainingCalories)} oltre target`}
            </span>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 ${
              totalCalories > profile.targetCalories
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{
              width: `${Math.min(100, (totalCalories / (profile.targetCalories || 1)) * 100)}%`
            }}
          />
        </div>

        {/* 3 Macro Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-sky-400">Proteine</span>
              <span className="font-mono text-slate-300 font-bold">{totalProtein}g</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalProtein / (profile.targetProtein || 1)) * 100)}%`
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-right font-medium">
              Target: {profile.targetProtein}g
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-amber-400">Carbo</span>
              <span className="font-mono text-slate-300 font-bold">{totalCarbs}g</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalCarbs / (profile.targetCarbs || 1)) * 100)}%`
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-right font-medium">
              Target: {profile.targetCarbs}g
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-rose-400">Grassi</span>
              <span className="font-mono text-slate-300 font-bold">{totalFat}g</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalFat / (profile.targetFat || 1)) * 100)}%`
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-right font-medium">
              Target: {profile.targetFat}g
            </div>
          </div>
        </div>
      </div>

      {/* Water Hydration Card */}
      <div className="ios-glass-card rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Idratazione</div>
            <div className="text-[15px] font-black font-mono text-white">
              {dietLog.waterMl || 0} / {profile.targetWaterMl} ml
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddWater(250)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-blue-400 font-bold text-xs active:scale-90 transition"
          >
            +250 ml
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-blue-400 font-bold text-xs active:scale-90 transition"
          >
            +500 ml
          </button>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {MEALS_CONFIG.map(({ type, label, icon: Icon }) => {
          const foods = dietLog.meals[type] || [];
          const mealKcal = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
          const mealP = Math.round(foods.reduce((sum, f) => sum + (f.protein || 0), 0));
          const mealC = Math.round(foods.reduce((sum, f) => sum + (f.carbs || 0), 0));
          const mealF = Math.round(foods.reduce((sum, f) => sum + (f.fat || 0), 0));

          return (
            <div
              key={type}
              className="ios-glass-card rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-white">{label}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {mealKcal} kcal • P:{mealP}g C:{mealC}g F:{mealF}g
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { triggerHaptic(8); setModalMealType(type); }}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-slate-800/80 active:scale-90 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi</span>
                </button>
              </div>

              {/* Meal Items */}
              <div className="mt-2.5 space-y-1.5">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="p-2.5 bg-slate-950/70 border border-slate-800/60 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{food.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {food.portion} •{' '}
                        <strong className="text-emerald-400">{food.calories} kcal</strong> (P:
                        {food.protein}g C:{food.carbs}g F:{food.fat}g)
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFood(type, food.id)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg active:scale-90 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {foods.length === 0 && (
                  <div className="py-2 text-center text-xs text-slate-500">
                    Nessun alimento registrato.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalMealType && (
        <AddFoodModal
          mealType={modalMealType}
          savedFoods={savedFoods}
          onAddFood={handleAddFood}
          onClose={() => setModalMealType(null)}
        />
      )}
    </div>
  );
};
