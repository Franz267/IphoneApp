import { ExerciseDefinition, SavedFood, UserProfile, WorkoutRoutine } from '../types';

export const DEFAULT_EXERCISES: ExerciseDefinition[] = [
  // Petto
  { id: 'ex_bench_press', name: 'Panca Piana con Bilanciere', category: 'petto', defaultRestSeconds: 120 },
  { id: 'ex_incline_dumbbells', name: 'Panca Inclinata con Manubri', category: 'petto', defaultRestSeconds: 90 },
  { id: 'ex_chest_cable_fly', name: 'Croci ai Cavi', category: 'petto', defaultRestSeconds: 60 },
  { id: 'ex_dips', name: 'Dips alle Parallele', category: 'petto', defaultRestSeconds: 90 },
  { id: 'ex_pushups', name: 'Piegamenti sulle Braccia (Push-ups)', category: 'petto', defaultRestSeconds: 60 },
  
  // Schiena
  { id: 'ex_deadlift', name: 'Stacco da Terra (Deadlift)', category: 'schiena', defaultRestSeconds: 150 },
  { id: 'ex_pullups', name: 'Trazioni alla Sbarra', category: 'schiena', defaultRestSeconds: 90 },
  { id: 'ex_barbell_row', name: 'Rematore con Bilanciere', category: 'schiena', defaultRestSeconds: 90 },
  { id: 'ex_lat_machine', name: 'Lat Machine avanti', category: 'schiena', defaultRestSeconds: 75 },
  { id: 'ex_pulley', name: 'Pulley Basso al Cavo', category: 'schiena', defaultRestSeconds: 75 },

  // Gambe
  { id: 'ex_squat', name: 'Squat con Bilanciere', category: 'gambe', defaultRestSeconds: 150 },
  { id: 'ex_leg_press', name: 'Leg Press 45°', category: 'gambe', defaultRestSeconds: 90 },
  { id: 'ex_leg_extension', name: 'Leg Extension', category: 'gambe', defaultRestSeconds: 60 },
  { id: 'ex_leg_curl', name: 'Leg Curl (Sdraiato o Seduto)', category: 'gambe', defaultRestSeconds: 60 },
  { id: 'ex_lunges', name: 'Affondi con Manubri', category: 'gambe', defaultRestSeconds: 75 },
  { id: 'ex_calf_raise', name: 'Calf Raise (Polpacci)', category: 'gambe', defaultRestSeconds: 60 },

  // Spalle
  { id: 'ex_overhead_press', name: 'Military Press / Lento Avanti', category: 'spalle', defaultRestSeconds: 90 },
  { id: 'ex_lateral_raise', name: 'Alzate Laterali con Manubri', category: 'spalle', defaultRestSeconds: 60 },
  { id: 'ex_face_pull', name: 'Face Pull ai Cavi', category: 'spalle', defaultRestSeconds: 60 },
  { id: 'ex_shoulder_press_db', name: 'Spinte Spalle con Manubri', category: 'spalle', defaultRestSeconds: 90 },

  // Braccia
  { id: 'ex_barbell_curl', name: 'Curl con Bilanciere EZ', category: 'braccia', defaultRestSeconds: 60 },
  { id: 'ex_hammer_curl', name: 'Hammer Curl con Manubri', category: 'braccia', defaultRestSeconds: 60 },
  { id: 'ex_triceps_pushdown', name: 'Pushdown Tricipiti al Cavo', category: 'braccia', defaultRestSeconds: 60 },
  { id: 'ex_french_press', name: 'French Press su Panca', category: 'braccia', defaultRestSeconds: 75 },

  // Addome & Cardio
  { id: 'ex_plank', name: 'Plank Addominale', category: 'addome', defaultRestSeconds: 60 },
  { id: 'ex_cable_crunch', name: 'Crunch ai Cavi', category: 'addome', defaultRestSeconds: 60 },
  { id: 'ex_leg_raise', name: 'Leg Raise alla Sbarra', category: 'addome', defaultRestSeconds: 60 },
  { id: 'ex_treadmill', name: 'Tapis Roulant / Corsa', category: 'cardio', defaultRestSeconds: 0 }
];

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine_push',
    name: 'Push (Spinta: Petto, Spalle, Tricipiti)',
    description: 'Panca piana, spinte con manubri, lento avanti, alzate laterali e tricipiti.',
    exercises: [
      { exerciseId: 'ex_bench_press', targetSets: 4, targetReps: '8-10', targetWeight: 60 },
      { exerciseId: 'ex_incline_dumbbells', targetSets: 3, targetReps: '10-12', targetWeight: 22 },
      { exerciseId: 'ex_overhead_press', targetSets: 3, targetReps: '8-10', targetWeight: 40 },
      { exerciseId: 'ex_lateral_raise', targetSets: 4, targetReps: '12-15', targetWeight: 10 },
      { exerciseId: 'ex_triceps_pushdown', targetSets: 3, targetReps: '12-15', targetWeight: 25 }
    ]
  },
  {
    id: 'routine_pull',
    name: 'Pull (Tirata: Schiena e Bicipiti)',
    description: 'Trazioni, rematore con bilanciere, lat machine, face pull e curl bicipiti.',
    exercises: [
      { exerciseId: 'ex_pullups', targetSets: 4, targetReps: '6-8' },
      { exerciseId: 'ex_barbell_row', targetSets: 4, targetReps: '8-10', targetWeight: 50 },
      { exerciseId: 'ex_lat_machine', targetSets: 3, targetReps: '10-12', targetWeight: 55 },
      { exerciseId: 'ex_face_pull', targetSets: 3, targetReps: '15', targetWeight: 20 },
      { exerciseId: 'ex_barbell_curl', targetSets: 3, targetReps: '10-12', targetWeight: 25 }
    ]
  },
  {
    id: 'routine_legs',
    name: 'Legs & Core (Gambe e Addome)',
    description: 'Squat, leg press, leg curl, polpacci e addominali.',
    exercises: [
      { exerciseId: 'ex_squat', targetSets: 4, targetReps: '8-10', targetWeight: 70 },
      { exerciseId: 'ex_leg_press', targetSets: 3, targetReps: '10-12', targetWeight: 140 },
      { exerciseId: 'ex_leg_curl', targetSets: 3, targetReps: '12-15', targetWeight: 40 },
      { exerciseId: 'ex_calf_raise', targetSets: 4, targetReps: '15-20', targetWeight: 50 },
      { exerciseId: 'ex_plank', targetSets: 3, targetReps: '60 sec' }
    ]
  }
];

export const DEFAULT_SAVED_FOODS: SavedFood[] = [
  { id: 'f_pollo', name: 'Petto di Pollo ai ferri', defaultPortion: '150g', calories: 165, protein: 35, carbs: 0, fat: 2, category: 'Proteine' },
  { id: 'f_riso', name: 'Riso Basmati (a crudo)', defaultPortion: '80g', calories: 280, protein: 6, carbs: 62, fat: 0.5, category: 'Carboidrati' },
  { id: 'f_pasta', name: 'Pasta di Semola', defaultPortion: '100g', calories: 355, protein: 12, carbs: 72, fat: 1.5, category: 'Carboidrati' },
  { id: 'f_uovo', name: 'Uova Intere', defaultPortion: '2 uova (110g)', calories: 155, protein: 13, carbs: 1, fat: 11, category: 'Proteine' },
  { id: 'f_albume', name: 'Albume d’uovo liquido', defaultPortion: '150g', calories: 75, protein: 16, carbs: 1, fat: 0.3, category: 'Proteine' },
  { id: 'f_avena', name: 'Fiocchi d’Avena', defaultPortion: '60g', calories: 220, protein: 8, carbs: 36, fat: 4, category: 'Carboidrati' },
  { id: 'f_olio', name: 'Olio Extravergine d’Oliva', defaultPortion: '1 cucchiaio (10g)', calories: 88, protein: 0, carbs: 0, fat: 10, category: 'Grassi' },
  { id: 'f_salmone', name: 'Salmone fresco o affumicato', defaultPortion: '120g', calories: 215, protein: 24, carbs: 0, fat: 13, category: 'Proteine' },
  { id: 'f_tonno', name: 'Tonno al naturale (sgocciolato)', defaultPortion: '1 scatoletta (80g)', calories: 80, protein: 18, carbs: 0, fat: 0.5, category: 'Proteine' },
  { id: 'f_yogurt', name: 'Yogurt Greco 0% grassi', defaultPortion: '170g', calories: 95, protein: 17, carbs: 6, fat: 0, category: 'Proteine' },
  { id: 'f_whey', name: 'Proteine Whey in polvere', defaultPortion: '1 misurino (30g)', calories: 115, protein: 25, carbs: 1.5, fat: 0.8, category: 'Integratori' },
  { id: 'f_mandorle', name: 'Mandorle o Noci', defaultPortion: '30g', calories: 180, protein: 6, carbs: 4, fat: 15, category: 'Grassi' },
  { id: 'f_banana', name: 'Banana', defaultPortion: '1 media (120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'Frutta' },
  { id: 'f_mela', name: 'Mela', defaultPortion: '1 media (180g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'Frutta' },
  { id: 'f_pane', name: 'Pane Integrale', defaultPortion: '2 fette (60g)', calories: 150, protein: 6, carbs: 28, fat: 2, category: 'Carboidrati' }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Atleta',
  targetCalories: 2200,
  targetProtein: 150,
  targetCarbs: 230,
  targetFat: 65,
  targetWaterMl: 2500,
  defaultRestSeconds: 90,
  soundEnabled: true,
  currentWeightKg: 75
};
