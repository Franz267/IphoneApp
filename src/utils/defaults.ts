import { ExerciseDefinition, SavedFood, UserProfile, WorkoutRoutine } from '../types';

export const DEFAULT_EXERCISES: ExerciseDefinition[] = [
  // Giorno 1 - Upper
  { id: 'ex_chest_press_mach', name: 'Chest Press (Macchina)', category: 'petto', defaultRestSeconds: 105 },
  { id: 'ex_lat_machine_prona', name: 'Lat Machine (Presa prona larga)', category: 'schiena', defaultRestSeconds: 105 },
  { id: 'ex_shoulder_press_mach', name: 'Shoulder Press (Macchina)', category: 'spalle', defaultRestSeconds: 90 },
  { id: 'ex_pulley_basso', name: 'Pulley Basso (o Row Machine)', category: 'schiena', defaultRestSeconds: 90 },
  { id: 'ex_alzate_laterali', name: 'Alzate Laterali (Manubri o Macchina)', category: 'spalle', defaultRestSeconds: 60 },
  { id: 'ex_pushdown_cavi', name: 'Pushdown ai Cavi (Corda o barra - Tricipiti)', category: 'braccia', defaultRestSeconds: 60 },
  { id: 'ex_curl_cavi_bassi', name: 'Curl ai Cavi Bassi o Manubri (Bicipiti)', category: 'braccia', defaultRestSeconds: 60 },

  // Giorno 2 - Lower (Salvaginocchio)
  { id: 'ex_leg_press_45', name: 'Leg Press 45° o Orizzontale (Piedi medio-alti)', category: 'gambe', defaultRestSeconds: 120 },
  { id: 'ex_leg_curl', name: 'Leg Curl (Seduto o Sdraiato - Femorali)', category: 'gambe', defaultRestSeconds: 90 },
  { id: 'ex_leg_extension', name: 'Leg Extension (Carico controllato, no iperestensione)', category: 'gambe', defaultRestSeconds: 75 },
  { id: 'ex_hip_thrust_mach', name: 'Hip Thrust alla Macchina (o Glute Machine)', category: 'gambe', defaultRestSeconds: 90 },
  { id: 'ex_calf_machine', name: 'Calf Machine (Polpacci in piedi o seduto)', category: 'gambe', defaultRestSeconds: 60 },
  { id: 'ex_crunch_machine', name: 'Crunch alla Macchina (o Plank 45-60")', category: 'addome', defaultRestSeconds: 60 },

  // Giorno 3 - Full Body + Tricipiti & Avambracci
  { id: 'ex_hack_squat', name: 'Hack Squat o Leg Press (Carico moderato)', category: 'gambe', defaultRestSeconds: 120 },
  { id: 'ex_pectoral_machine', name: 'Pectoral Machine (o Chest Press Inclinata)', category: 'petto', defaultRestSeconds: 90 },
  { id: 'ex_vertical_row', name: 'Vertical Row / T-Bar Guidata (Dorso)', category: 'schiena', defaultRestSeconds: 90 },
  { id: 'ex_french_press_cavi', name: 'French Press ai Cavi sopra la testa (Capo lungo)', category: 'braccia', defaultRestSeconds: 75 },
  { id: 'ex_hammer_curl', name: 'Hammer Curl (Manubri o corda - Brachioradiale)', category: 'braccia', defaultRestSeconds: 60 },
  { id: 'ex_wrist_curl', name: 'Wrist Curl (Flessioni polsi - Avambracci)', category: 'braccia', defaultRestSeconds: 50 },
  { id: 'ex_crunch_inverso', name: 'Crunch Inverso o Cable Crunch (Addome)', category: 'addome', defaultRestSeconds: 60 },

  // Altri esercizi comuni
  { id: 'ex_bench_press', name: 'Panca Piana con Bilanciere', category: 'petto', defaultRestSeconds: 120 },
  { id: 'ex_squat', name: 'Squat con Bilanciere', category: 'gambe', defaultRestSeconds: 150 },
  { id: 'ex_pullups', name: 'Trazioni alla Sbarra', category: 'schiena', defaultRestSeconds: 90 },
  { id: 'ex_plank', name: 'Plank Addominale', category: 'addome', defaultRestSeconds: 60 }
];

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine_day1_upper',
    name: 'Giorno 1 – Lunedì • Upper',
    description: 'Chest Press, Lat Machine, Shoulder Press, Pulley, Alzate laterali, Pushdown e Curl bicipiti.',
    exercises: [
      { exerciseId: 'ex_chest_press_mach', targetSets: 4, targetReps: '8-10', targetWeight: 40 },
      { exerciseId: 'ex_lat_machine_prona', targetSets: 4, targetReps: '8-10', targetWeight: 45 },
      { exerciseId: 'ex_shoulder_press_mach', targetSets: 3, targetReps: '10-12', targetWeight: 25 },
      { exerciseId: 'ex_pulley_basso', targetSets: 3, targetReps: '10-12', targetWeight: 35 },
      { exerciseId: 'ex_alzate_laterali', targetSets: 3, targetReps: '12-15', targetWeight: 8 },
      { exerciseId: 'ex_pushdown_cavi', targetSets: 3, targetReps: '10-12', targetWeight: 20 },
      { exerciseId: 'ex_curl_cavi_bassi', targetSets: 3, targetReps: '10-12', targetWeight: 15 }
    ]
  },
  {
    id: 'routine_day2_lower',
    name: 'Giorno 2 – Mercoledì • Lower (Salvaginocchio)',
    description: 'Leg Press medio-alta, Leg Curl, Leg Extension controllata, Hip Thrust, Calf e Crunch.',
    exercises: [
      { exerciseId: 'ex_leg_press_45', targetSets: 4, targetReps: '10-12', targetWeight: 100 },
      { exerciseId: 'ex_leg_curl', targetSets: 4, targetReps: '10-12', targetWeight: 35 },
      { exerciseId: 'ex_leg_extension', targetSets: 3, targetReps: '12-15', targetWeight: 25 },
      { exerciseId: 'ex_hip_thrust_mach', targetSets: 3, targetReps: '10-12', targetWeight: 40 },
      { exerciseId: 'ex_calf_machine', targetSets: 4, targetReps: '12-15', targetWeight: 40 },
      { exerciseId: 'ex_crunch_machine', targetSets: 3, targetReps: '15', targetWeight: 30 }
    ]
  },
  {
    id: 'routine_day3_fullbody',
    name: 'Giorno 3 – Venerdì • Full Body + Tricipiti & Avambracci',
    description: 'Hack/Leg Press, Pectoral Machine, Vertical Row, French Press, Hammer Curl, Wrist Curl, Crunch inverso.',
    exercises: [
      { exerciseId: 'ex_hack_squat', targetSets: 3, targetReps: '10-12', targetWeight: 50 },
      { exerciseId: 'ex_pectoral_machine', targetSets: 3, targetReps: '10-12', targetWeight: 35 },
      { exerciseId: 'ex_vertical_row', targetSets: 3, targetReps: '10-12', targetWeight: 40 },
      { exerciseId: 'ex_french_press_cavi', targetSets: 3, targetReps: '10-12', targetWeight: 17.5 },
      { exerciseId: 'ex_hammer_curl', targetSets: 3, targetReps: '10-12', targetWeight: 12 },
      { exerciseId: 'ex_wrist_curl', targetSets: 3, targetReps: '15-20', targetWeight: 10 },
      { exerciseId: 'ex_crunch_inverso', targetSets: 3, targetReps: '12-15' }
    ]
  }
];

export const WORKOUT_GUIDELINES = {
  title: 'Regole di Progressione & Tutela Crociato',
  rules: [
    {
      title: 'Scelta del carico (RIR 1–2)',
      desc: 'Utilizza un peso che ti permetta di arrivare all’ultima ripetizione con 1–2 ripetizioni di margine, mantenendo sempre una tecnica pulita.'
    },
    {
      title: 'Progressione settimanale',
      desc: 'Appena completi tutte le serie al limite superiore del range (es. 4×10 sulla Chest Press), la settimana successiva aumenta il carico di 2,5–5 kg e riparti dal limite inferiore (es. 4×8).'
    },
    {
      title: 'Riscaldamento salvaginocchio (Obbligatorio)',
      desc: '5–8 minuti di cyclette leggera + mobilità anca/caviglia prima del leg day. Evita sempre il blocco articolare completo in estensione sui macchinari.'
    },
    {
      title: 'Cardio nei giorni off',
      desc: 'Sostituisci la corsa con camminata veloce (45–60 minuti, preferibilmente in salita o con pendenza sul tapis roulant) finché il crociato dà fastidio all’impatto.'
    },
    {
      title: 'Segnale di stop immediato',
      desc: 'Se avverti dolore o gonfiore articolare al ginocchio durante l’allenamento o la camminata, interrompi subito l’esercizio.'
    }
  ]
};

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
