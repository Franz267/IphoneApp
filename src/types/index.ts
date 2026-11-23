export type MuscleCategory = 
  | 'petto' 
  | 'schiena' 
  | 'gambe' 
  | 'spalle' 
  | 'braccia' 
  | 'addome' 
  | 'cardio' 
  | 'altro';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: MuscleCategory;
  defaultRestSeconds?: number;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // in kg
  reps: number;
  completed: boolean;
  rpe?: number; // 1 to 10
  isWarmup?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  category: MuscleCategory;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  title: string;
  startTime: number; // timestamp
  endTime?: number;
  durationSeconds: number;
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolumeKg: number;
  completed: boolean;
}

export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string; // e.g. "8-10" or "10"
  targetWeight?: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description?: string;
  category?: string;
  exercises: RoutineExercise[];
}

// Nutrition
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  portion: string; // e.g. "150g" or "1 piatto"
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface DailyDietLog {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snack: FoodItem[];
  };
  waterMl: number;
  notes?: string;
}

export interface SavedFood {
  id: string;
  name: string;
  defaultPortion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category?: string;
}

// User Profile & Settings
export interface UserProfile {
  name: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWaterMl: number;
  defaultRestSeconds: number;
  soundEnabled: boolean;
  currentWeightKg?: number;
}

export interface WeightRecord {
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface FullAppDataBackup {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  routines: WorkoutRoutine[];
  exercises: ExerciseDefinition[];
  workoutSessions: WorkoutSession[];
  activeWorkout: WorkoutSession | null;
  dietLogs: Record<string, DailyDietLog>;
  savedFoods: SavedFood[];
  weightRecords: WeightRecord[];
}
