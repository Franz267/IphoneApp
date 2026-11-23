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
  RefreshCw,
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    Storage.exportBackupToFile();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as FullAppDataBackup;
        const ok = Storage.restoreBackup(json);
        if (ok) {
          setImportStatus('Backup ripristinato con successo! 🚀');
          onDataRestored();
        } else {
          setImportStatus('Errore: formato file backup non valido.');
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
      Storage.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Installation Guide Banner for iOS */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              Come installare su iPhone (PWA)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gira come un'app nativa senza App Store e funziona al 100% offline.
            </p>

            <ol className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Apri la pagina web con <strong>Safari</strong> su iOS</span>
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
                <span>Scorri in basso e scegli <strong>"Aggiungi alla schermata Home"</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <span>Tocca <strong>"Aggiungi"</strong> in alto a destra. Fatto! 🎉</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Target Macros Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-lg text-white">I Tuoi Obiettivi Nutrizionali</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-emerald-400 block mb-1">
                Calorie Target (kcal)
              </label>
              <input
                type="number"
                min="500"
                max="8000"
                value={formData.targetCalories}
                onChange={(e) =>
                  setFormData({ ...formData, targetCalories: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-sky-400 block mb-1">
                Proteine Target (g)
              </label>
              <input
                type="number"
                min="20"
                max="500"
                value={formData.targetProtein}
                onChange={(e) =>
                  setFormData({ ...formData, targetProtein: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-400 block mb-1">
                Carboidrati Target (g)
              </label>
              <input
                type="number"
                min="20"
                max="800"
                value={formData.targetCarbs}
                onChange={(e) =>
                  setFormData({ ...formData, targetCarbs: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-rose-400 block mb-1">
                Grassi Target (g)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.targetFat}
                onChange={(e) =>
                  setFormData({ ...formData, targetFat: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-blue-400 block mb-1">
                Acqua Target (ml)
              </label>
              <input
                type="number"
                step="250"
                value={formData.targetWaterMl}
                onChange={(e) =>
                  setFormData({ ...formData, targetWaterMl: parseInt(e.target.value, 10) || 2000 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Timer Recupero (sec)
              </label>
              <input
                type="number"
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
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              {formData.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-semibold text-slate-300">
                Suoni Beep del Timer di Recupero
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Obiettivi Salvati!</span>
              </>
            ) : (
              <span>Salva Obiettivi</span>
            )}
          </button>
        </form>
      </div>

      {/* Backup & Local Data Security */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-lg text-white">Dati Locali & Backup</h3>
        </div>
        <p className="text-xs text-slate-400">
          I tuoi dati risiedono solo sul tuo telefono. Per sicurezza, puoi esportare un file di
          backup in qualsiasi momento e conservarlo o ripristinarlo su un altro dispositivo.
        </p>

        {importStatus && (
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-emerald-400 font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="p-3.5 bg-slate-950 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition group"
          >
            <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white">Esporta Backup JSON</span>
          </button>

          <label className="p-3.5 bg-slate-950 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition group cursor-pointer">
            <Upload className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white">Ripristina Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={handleResetData}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 text-red-400 font-semibold text-xs active:scale-95 transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Cancella Tutti i Dati Locali (Reset)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
