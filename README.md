# FitPulse - Web App PWA 100% Offline (Palestra & Dieta)

FitPulse è una **Progressive Web App (PWA)** mobile-first, creata appositamente per essere installata su **iPhone** (e Android) tramite Safari senza passare per l'App Store e senza alcun costo per Apple Developer.

---

## ⚡ Caratteristiche Principali

### 🏋️ Palestra (Workout Tracker)
- **Schede & Routine**: Crea e modifica schede personalizzate (es. *Push*, *Pull*, *Legs*, *Full Body*).
- **Allenamento Live**:
  - Timer della sessione in tempo reale.
  - Tabella serie interattiva: **KG**, **Ripetizioni** e tasto di spunta completamento.
  - Aggiunta rapida serie con precompilazione automatica dell'ultimo carico/reps.
  - **Timer di recupero integrato** (30s, 60s, 90s, 120s...) con controlli veloci (+30s / -15s / salta).
  - Feedback sonoro synthesize offline tramite **Web Audio API** (nessun file audio esterno da scaricare).
  - Celebrazione con coriandoli e calcolo del volume totale (kg sollevati) a fine workout.
  - **Protezione anti-perdita dati**: se chiudi l'app per sbaglio o Safari si ricarica, l'allenamento in corso resta memorizzato e viene ripreso all'istante!

### 🥗 Dieta & Alimentazione (Nutrition Tracker)
- **Navigazione giornaliera**: passa rapidamente da Oggi a Ieri o a qualsiasi data.
- **Cruscotto Calorie & Macro**:
  - Calorie consumate vs target impostato e calorie rimanenti.
  - 3 barre di avanzamento grafiche per **Proteine (g)**, **Carboidrati (g)** e **Grassi (g)**.
- **Pasti della Giornata**: suddivisione chiara in *Colazione*, *Pranzo*, *Cena* e *Spuntini*.
- **Libreria Alimenti Frequenti**: include già 15+ alimenti sani comuni (petto di pollo, riso basmati, uova, avena, olio d'oliva, salmone, yogurt greco, ecc.) e permette di salvare qualsiasi nuovo cibo con 1 click.
- **Idratazione**: contatore rapido per l'acqua (+250ml, +500ml).

### 🏆 Storico & Record Personali (PRs)
- Cronologia completa di tutte le sessioni svolte con data, durata ed esercizi dettagliati.
- **Personal Records (PR)**: calcola e tiene traccia in automatico del carico massimo mai sollevato per ciascun esercizio.
- **Monitoraggio Peso Corporeo**: registra il tuo peso nel tempo.

### 🔒 100% Locale, Privacy & Backup
- Nessun server, nessun database esterno, nessun account obbligatorio.
- **Export Backup JSON**: scarica in qualsiasi momento un file con tutto lo storico dei tuoi dati.
- **Ripristina Backup JSON**: carica il file su qualsiasi telefono o computer per trasferire tutti i tuoi progressi.

---

## 📲 Come Installare su iPhone (Safari)

1. Apri il link dell'app su **Safari** (es. il link distribuito su Cloudflare Pages o GitHub Pages).
2. Tocca l'icona di **Condivisione** in basso al centro (il quadrato con la freccia rivolta verso l'alto).
3. Scorri l'elenco e tocca **"Aggiungi alla schermata Home"**.
4. Tocca **"Aggiungi"** in alto a destra.
5. Fatto! Troverai l'icona di **FitPulse** sulla tua schermata Home. Aprendola si avvierà a schermo intero come una vera app nativa, memorizzata nella cache locale offline.

---

## 🚀 Come Pubblicarla Gratis in 2 Minuti

### Opzione A: Cloudflare Pages (La più veloce in assoluto - Drag & Drop)
1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com/) (account gratuito).
2. Seleziona **Workers & Pages** -> **Create application** -> **Pages** -> **Upload assets**.
3. Assegna un nome al progetto (es. `la-mia-palestra`).
4. Trascina la cartella `dist` generata da `npm run build`.
5. Clicca **Deploy Site**: riceverai immediatamente un link HTTPS (es. `https://la-mia-palestra.pages.dev`) da aprire sul tuo iPhone!

### Opzione B: GitHub Pages (Automatico con Git)
1. Crea un repository su GitHub (può essere anche privato).
2. Nel tuo terminale:
   ```bash
   git init
   git add .
   git commit -m "Initial commit FitPulse PWA"
   git branch -M main
   git remote add origin https://github.com/<TUO-UTENTE>/<TUO-REPO>.git
   git push -u origin main
   ```
3. Su GitHub, vai in **Settings** -> **Pages** -> sotto **Build and deployment**, seleziona **GitHub Actions**.
4. Il workflow già incluso in `.github/workflows/deploy.yml` compilerà e pubblicherà automaticamente la tua app.

---

## 💻 Comandi per Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Compila la build di produzione per l'offline
npm run build

# Anteprima locale
npm run preview
```
