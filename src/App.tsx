import React, { useState, useEffect } from 'react';
import { Storage } from './utils/storage';
import {
  DailyDietLog,
  ExerciseDefinition,
  MuscleCategory,
  SavedFood,
  UserProfile,
  WeightRecord,
  WorkoutRoutine,
  WorkoutSession
} from './types';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { WorkoutTab } from './components/WorkoutTab/WorkoutTab';
import { ActiveWorkoutModal } from './components/WorkoutTab/ActiveWorkoutModal';
import { DietTab } from './components/DietTab/DietTab';
import { HistoryTab } from './components/HistoryTab/HistoryTab';
import { SettingsTab } from './components/SettingsTab/SettingsTab';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('workout');

  // Loaded state from LocalStorage / IndexedDB
  const [profile, setProfile] = useState<UserProfile>(() => Storage.getProfile());
  const [exercisesLibrary, setExercisesLibrary] = useState<ExerciseDefinition[]>(() =>
    Storage.getExercises()
  );
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => Storage.getRoutines());
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => Storage.getSessions());
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() =>
    Storage.getActiveWorkout()
  );
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>(() => Storage.getSavedFoods());
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() =>
    Storage.getWeightRecords()
  );

  // Nutrition state for currently selected date
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState<string>(todayStr);
  const [dietLog, setDietLog] = useState<DailyDietLog>(() => Storage.getDietLog(todayStr));

  // Sync diet log when selected date changes
  useEffect(() => {
    setDietLog(Storage.getDietLog(currentDate));
  }, [currentDate]);

  // Sync active workout state to storage
  useEffect(() => {
    Storage.saveActiveWorkout(activeWorkout);
  }, [activeWorkout]);

  // Sync profile state
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    Storage.saveProfile(newProfile);
  };

  // Workout Actions
  const handleStartFreeWorkout = () => {
    const newSession: WorkoutSession = {
      id: 'ws_' + Date.now(),
      date: new Date().toISOString(),
      title: 'Allenamento Libero',
      startTime: Date.now(),
      durationSeconds: 0,
      exercises: [],
      totalVolumeKg: 0,
      completed: false
    };
    setActiveWorkout(newSession);
  };

  const handleStartRoutineWorkout = (routine: WorkoutRoutine) => {
    const initialExercises = routine.exercises.map((re) => {
      const exDef = exercisesLibrary.find((e) => e.id === re.exerciseId);
      const setsCount = re.targetSets || 3;
      const sets = Array.from({ length: setsCount }, (_, i) => ({
        id: 'set_' + Date.now() + '_' + i,
        setNumber: i + 1,
        weight: re.targetWeight || 20,
        reps: parseInt(re.targetReps, 10) || 10,
        completed: false
      }));

      return {
        id: 'we_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        exerciseId: re.exerciseId,
        name: exDef ? exDef.name : 'Esercizio',
        category: exDef ? exDef.category : ('altro' as MuscleCategory),
        sets
      };
    });

    const newSession: WorkoutSession = {
      id: 'ws_' + Date.now(),
      date: new Date().toISOString(),
      title: routine.name,
      startTime: Date.now(),
      durationSeconds: 0,
      exercises: initialExercises,
      totalVolumeKg: 0,
      completed: false
    };

    setActiveWorkout(newSession);
  };

  const handleUpdateActiveWorkout = (updated: WorkoutSession) => {
    setActiveWorkout(updated);
  };

  const handleFinishActiveWorkout = (completedWorkout: WorkoutSession) => {
    const updatedSessions = Storage.addSession(completedWorkout);
    setSessions(updatedSessions);
    setActiveWorkout(null);
    setCurrentTab('history');
  };

  const handleCancelActiveWorkout = () => {
    if (confirm('Vuoi davvero annullare e cancellare questo allenamento in corso?')) {
      setActiveWorkout(null);
    }
  };

  // Routine management
  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    const updated = Storage.saveRoutine(routine);
    setRoutines(updated);
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = Storage.deleteRoutine(id);
    setRoutines(updated);
  };

  const handleAddNewExercise = (name: string, category: MuscleCategory): ExerciseDefinition => {
    const newEx: ExerciseDefinition = {
      id: 'ex_' + Date.now(),
      name,
      category,
      defaultRestSeconds: 90
    };
    const updated = Storage.addExercise(newEx);
    setExercisesLibrary(updated);
    return newEx;
  };

  // Diet management
  const handleUpdateDietLog = (date: string, log: DailyDietLog) => {
    Storage.saveDietLog(date, log);
    setDietLog(log);
  };

  const handleSaveNewFavoriteFood = (food: SavedFood) => {
    const updated = Storage.addSavedFood(food);
    setSavedFoods(updated);
  };

  // History & Weight actions
  const handleDeleteSession = (id: string) => {
    const updated = Storage.deleteSession(id);
    setSessions(updated);
  };

  const handleAddWeightRecord = (weightKg: number) => {
    const updated = Storage.saveWeightRecord({
      date: currentDate,
      weightKg
    });
    setWeightRecords(updated);
    // Also update profile current weight
    handleUpdateProfile({ ...profile, currentWeightKg: weightKg });
  };

  // Restore action
  const handleDataRestored = () => {
    setProfile(Storage.getProfile());
    setExercisesLibrary(Storage.getExercises());
    setRoutines(Storage.getRoutines());
    setSessions(Storage.getSessions());
    setActiveWorkout(Storage.getActiveWorkout());
    setSavedFoods(Storage.getSavedFoods());
    setWeightRecords(Storage.getWeightRecords());
    setDietLog(Storage.getDietLog(currentDate));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none safe-top safe-bottom">
      {/* Top Header */}
      <Header activeTab={currentTab} hasActiveWorkout={activeWorkout !== null} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {currentTab === 'workout' && (
          <WorkoutTab
            activeWorkout={activeWorkout}
            routines={routines}
            exercisesLibrary={exercisesLibrary}
            completedSessions={sessions}
            onStartFreeWorkout={handleStartFreeWorkout}
            onStartRoutineWorkout={handleStartRoutineWorkout}
            onResumeWorkout={() => {
              // already active, will be shown via ActiveWorkoutModal
            }}
            onSaveRoutine={handleSaveRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onAddNewExercise={handleAddNewExercise}
            onViewHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'diet' && (
          <DietTab
            currentDate={currentDate}
            dietLog={dietLog}
            profile={profile}
            savedFoods={savedFoods}
            onDateChange={setCurrentDate}
            onUpdateDietLog={handleUpdateDietLog}
            onSaveNewFavoriteFood={handleSaveNewFavoriteFood}
          />
        )}

        {currentTab === 'history' && (
          <HistoryTab
            sessions={sessions}
            weightRecords={weightRecords}
            onDeleteSession={handleDeleteSession}
            onAddWeightRecord={handleAddWeightRecord}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onDataRestored={handleDataRestored}
          />
        )}
      </main>

      {/* Active Workout Modal (when user has an ongoing session) */}
      {activeWorkout && currentTab === 'workout' && (
        <ActiveWorkoutModal
          workout={activeWorkout}
          exercisesLibrary={exercisesLibrary}
          soundEnabled={profile.soundEnabled}
          defaultRestSeconds={profile.defaultRestSeconds}
          onUpdateWorkout={handleUpdateActiveWorkout}
          onFinishWorkout={handleFinishActiveWorkout}
          onCancelWorkout={handleCancelActiveWorkout}
          onAddNewExerciseToLibrary={handleAddNewExercise}
        />
      )}

      {/* Bottom Tab Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        hasActiveWorkout={activeWorkout !== null}
      />
    </div>
  );
}
