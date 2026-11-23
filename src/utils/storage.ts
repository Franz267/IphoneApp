import {
  DEFAULT_EXERCISES,
  DEFAULT_ROUTINES,
  DEFAULT_SAVED_FOODS,
  DEFAULT_USER_PROFILE
} from './defaults';
import {
  DailyDietLog,
  ExerciseDefinition,
  FullAppDataBackup,
  SavedFood,
  UserProfile,
  WeightRecord,
  WorkoutRoutine,
  WorkoutSession
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'fitpulse_profile',
  ROUTINES: 'fitpulse_routines',
  EXERCISES: 'fitpulse_exercises',
  SESSIONS: 'fitpulse_sessions',
  ACTIVE_WORKOUT: 'fitpulse_active_workout',
  DIET_PREFIX: 'fitpulse_diet_',
  SAVED_FOODS: 'fitpulse_saved_foods',
  WEIGHT_RECORDS: 'fitpulse_weight_records'
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to read ${key}`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key}`, e);
  }
}

export const Storage = {
  // --- USER PROFILE ---
  getProfile(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE);
  },
  saveProfile(profile: UserProfile): void {
    safeSet(STORAGE_KEYS.PROFILE, profile);
  },

  // --- EXERCISES ---
  getExercises(): ExerciseDefinition[] {
    return safeGet<ExerciseDefinition[]>(STORAGE_KEYS.EXERCISES, DEFAULT_EXERCISES);
  },
  saveExercises(exercises: ExerciseDefinition[]): void {
    safeSet(STORAGE_KEYS.EXERCISES, exercises);
  },
  addExercise(exercise: ExerciseDefinition): ExerciseDefinition[] {
    const all = this.getExercises();
    const updated = [exercise, ...all.filter(e => e.id !== exercise.id)];
    this.saveExercises(updated);
    return updated;
  },

  // --- ROUTINES ---
  getRoutines(): WorkoutRoutine[] {
    return safeGet<WorkoutRoutine[]>(STORAGE_KEYS.ROUTINES, DEFAULT_ROUTINES);
  },
  saveRoutines(routines: WorkoutRoutine[]): void {
    safeSet(STORAGE_KEYS.ROUTINES, routines);
  },
  saveRoutine(routine: WorkoutRoutine): WorkoutRoutine[] {
    const all = this.getRoutines();
    const exists = all.some(r => r.id === routine.id);
    const updated = exists ? all.map(r => (r.id === routine.id ? routine : r)) : [...all, routine];
    this.saveRoutines(updated);
    return updated;
  },
  deleteRoutine(id: string): WorkoutRoutine[] {
    const all = this.getRoutines().filter(r => r.id !== id);
    this.saveRoutines(all);
    return all;
  },

  // --- ACTIVE WORKOUT ---
  getActiveWorkout(): WorkoutSession | null {
    return safeGet<WorkoutSession | null>(STORAGE_KEYS.ACTIVE_WORKOUT, null);
  },
  saveActiveWorkout(workout: WorkoutSession | null): void {
    safeSet(STORAGE_KEYS.ACTIVE_WORKOUT, workout);
  },

  // --- COMPLETED WORKOUT SESSIONS ---
  getSessions(): WorkoutSession[] {
    return safeGet<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
  },
  saveSessions(sessions: WorkoutSession[]): void {
    safeSet(STORAGE_KEYS.SESSIONS, sessions);
  },
  addSession(session: WorkoutSession): WorkoutSession[] {
    const all = this.getSessions();
    const updated = [session, ...all.filter(s => s.id !== session.id)];
    this.saveSessions(updated);
    return updated;
  },
  deleteSession(id: string): WorkoutSession[] {
    const all = this.getSessions().filter(s => s.id !== id);
    this.saveSessions(all);
    return all;
  },

  // --- DIET LOGS ---
  getDietLog(date: string): DailyDietLog {
    const key = `${STORAGE_KEYS.DIET_PREFIX}${date}`;
    const defaultLog: DailyDietLog = {
      date,
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      },
      waterMl: 0
    };
    return safeGet<DailyDietLog>(key, defaultLog);
  },
  saveDietLog(date: string, log: DailyDietLog): void {
    const key = `${STORAGE_KEYS.DIET_PREFIX}${date}`;
    safeSet(key, log);
  },
  getAllDietLogs(): Record<string, DailyDietLog> {
    const logs: Record<string, DailyDietLog> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.DIET_PREFIX)) {
        const date = key.replace(STORAGE_KEYS.DIET_PREFIX, '');
        logs[date] = safeGet(key, null as any);
      }
    }
    return logs;
  },

  // --- SAVED FOODS ---
  getSavedFoods(): SavedFood[] {
    return safeGet<SavedFood[]>(STORAGE_KEYS.SAVED_FOODS, DEFAULT_SAVED_FOODS);
  },
  saveSavedFoods(foods: SavedFood[]): void {
    safeSet(STORAGE_KEYS.SAVED_FOODS, foods);
  },
  addSavedFood(food: SavedFood): SavedFood[] {
    const all = this.getSavedFoods();
    const updated = [food, ...all.filter(f => f.id !== food.id)];
    this.saveSavedFoods(updated);
    return updated;
  },
  deleteSavedFood(id: string): SavedFood[] {
    const all = this.getSavedFoods().filter(f => f.id !== id);
    this.saveSavedFoods(all);
    return all;
  },

  // --- WEIGHT RECORDS ---
  getWeightRecords(): WeightRecord[] {
    return safeGet<WeightRecord[]>(STORAGE_KEYS.WEIGHT_RECORDS, []);
  },
  saveWeightRecord(record: WeightRecord): WeightRecord[] {
    const all = this.getWeightRecords().filter(r => r.date !== record.date);
    const updated = [...all, record].sort((a, b) => a.date.localeCompare(b.date));
    safeSet(STORAGE_KEYS.WEIGHT_RECORDS, updated);
    return updated;
  },

  // --- FULL BACKUP (EXPORT & IMPORT) ---
  createBackup(): FullAppDataBackup {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      routines: this.getRoutines(),
      exercises: this.getExercises(),
      workoutSessions: this.getSessions(),
      activeWorkout: this.getActiveWorkout(),
      dietLogs: this.getAllDietLogs(),
      savedFoods: this.getSavedFoods(),
      weightRecords: this.getWeightRecords()
    };
  },

  restoreBackup(backup: FullAppDataBackup): boolean {
    try {
      if (!backup || !backup.version) return false;
      if (backup.profile) this.saveProfile(backup.profile);
      if (backup.routines) this.saveRoutines(backup.routines);
      if (backup.exercises) this.saveExercises(backup.exercises);
      if (backup.workoutSessions) this.saveSessions(backup.workoutSessions);
      if (backup.activeWorkout !== undefined) this.saveActiveWorkout(backup.activeWorkout);
      if (backup.savedFoods) this.saveSavedFoods(backup.savedFoods);
      if (backup.weightRecords) safeSet(STORAGE_KEYS.WEIGHT_RECORDS, backup.weightRecords);

      if (backup.dietLogs) {
        Object.entries(backup.dietLogs).forEach(([date, log]) => {
          this.saveDietLog(date, log);
        });
      }
      return true;
    } catch (e) {
      console.error('Backup restore failed:', e);
      return false;
    }
  },

  exportBackupToFile(): void {
    const backup = this.createBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpulse-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  resetAllData(): void {
    localStorage.clear();
  }
};
