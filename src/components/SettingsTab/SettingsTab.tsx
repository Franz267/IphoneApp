import React, { useState } from 'react';
import {
  Download,
  Upload,
  Settings,
  Target,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { FullAppDataBackup, UserProfile } from '../../types';
import { Storage } from '../../utils/storage';

interface SettingsTabProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onDataRestored: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profile,
  onUpdateProfile,
  onDataRestored
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const triggerHaptic = (ms = 10) => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(ms);
    } catch {}
  };

  const handleForceUpdateApp = async () => {
    triggerHaptic(25);
    setIsUpdating(true);
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
    window.location.reload();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    triggerHaptic(12);
    Storage.exportBackupToFile();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic(15);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as FullAppDataBackup;
        const ok = Storage.restoreBackup(json);
        if (ok) {
          setImportStatus('Backup ripristinato con successo! 🚀');
          onDataRestored();
        } else {
          setImportStatus('Errore: formato file non valido.');
        }
      } catch (err) {
        setImportStatus('Errore durante la lettura del file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      confirm(
        'ATTENZIONE: Stai per cancellare tutti i dati locali. Assicurati di aver esportato un backup se desideri conservarli. Vuoi continuare?'
      )
    ) {
      triggerHaptic(30);
      Storage.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Installation Guide Banner for iOS */}
      <div className="ios-glass-card rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-[16px] text-white tracking-tight">
              Come installare su iPhone (PWA)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Si avvia come un'app nativa senza App Store e funziona al 100% offline.
            </p>

            <ol className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Apri la pagina web con <strong>Safari</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Tocca il tasto di condivisione (quadrato con freccia in su)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Scorri e tocca <strong>"Aggiungi alla schermata Home"</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <span>Tocca <strong>"Aggiungi"</strong> in alto a destra. Fatto! 🎉</span>
              </li>
            </ol>

            <button
              onClick={handleForceUpdateApp}
              disabled={isUpdating}
              className="mt-4 w-full py-2.5 px-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span>{isUpdating ? 'Ricaricamento in corso...' : 'Aggiorna App / Ricarica Cache 🔄'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Macros Form */}
      <div className="ios-glass-card rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-[16px] text-white tracking-tight">Obiettivi Nutrizionali</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">
                Calorie (kcal)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="500"
                max="8000"
                value={formData.targetCalories}
                onChange={(e) =>
                  setFormData({ ...formData, targetCalories: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-sky-400 block mb-1">
                Proteine (g)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="20"
                max="500"
                value={formData.targetProtein}
                onChange={(e) =>
                  setFormData({ ...formData, targetProtein: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-400 block mb-1">
                Carboidrati (g)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="20"
                max="800"
                value={formData.targetCarbs}
                onChange={(e) =>
                  setFormData({ ...formData, targetCarbs: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-rose-400 block mb-1">
                Grassi (g)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="10"
                max="300"
                value={formData.targetFat}
                onChange={(e) =>
                  setFormData({ ...formData, targetFat: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="text-xs font-bold text-blue-400 block mb-1">
                Acqua (ml)
              </label>
              <input
                type="number"
                inputMode="numeric"
                step="250"
                value={formData.targetWaterMl}
                onChange={(e) =>
                  setFormData({ ...formData, targetWaterMl: parseInt(e.target.value, 10) || 2000 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Timer Recupero (sec)
              </label>
              <input
                type="number"
                inputMode="numeric"
                step="15"
                min="15"
                max="600"
                value={formData.defaultRestSeconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultRestSeconds: parseInt(e.target.value, 10) || 90
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-[16px] font-bold text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              {formData.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-bold text-slate-300">
                Suoni Beep Timer Recupero
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded-md text-emerald-500 bg-slate-900 border-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 stroke-[3]" />
                <span>Obiettivi Salvati!</span>
              </>
            ) : (
              <span>Salva Obiettivi</span>
            )}
          </button>
        </form>
      </div>

      {/* Backup & Local Data Security */}
      <div className="ios-glass-card rounded-3xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-[16px] text-white tracking-tight">Dati & Backup</h3>
        </div>
        <p className="text-xs text-slate-400">
          I tuoi dati risiedono solo sul tuo iPhone. Puoi esportare un file di
          backup in qualsiasi momento.
        </p>

        {importStatus && (
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-emerald-400 font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleExportBackup}
            className="p-3.5 bg-slate-950/70 border border-slate-750 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white">Esporta Backup</span>
          </button>

          <label className="p-3.5 bg-slate-950/70 border border-slate-750 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition cursor-pointer">
            <Upload className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold text-white">Ripristina Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={handleResetData}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 font-semibold text-xs active:scale-95 transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Cancella Tutti i Dati Locali (Reset)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
