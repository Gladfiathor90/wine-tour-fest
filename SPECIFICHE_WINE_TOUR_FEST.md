# Specifiche Wine Tour Fest

Documento guida aggiornato per realizzare una web app stabile, semplice da gestire e pronta per l'uso durante Wine Tour Fest.

Principio guida: scegliere sempre la soluzione più semplice che sia stabile, chiara e manutenibile. Il progetto non deve diventare un'infrastruttura enterprise.

## 1. Obiettivo

Wine Tour Fest è una web app mobile-first per visitatori e organizzatori dell'evento.

I visitatori devono poter:

- vedere le informazioni generali dell'evento;
- consultare cantine, programma, news, sponsor e mappa;
- giocare senza registrazione con email/password;
- inserire un nickname;
- salvare il punteggio del gioco;
- vedere la classifica;
- consultare eventuali premi.

L'amministratore deve poter gestire dal browser:

- impostazioni evento;
- cantine;
- programma;
- news;
- sponsor;
- punti mappa;
- premi;
- apertura o chiusura del gioco;
- punteggio minimo per vincere;
- classifica e tentativi di gioco.

## 2. Principi di sviluppo

- Frontend React + Vite + TypeScript già esistente.
- Backend Supabase.
- Nessun uso di Supabase CLI.
- Nessun workflow complesso.
- Niente logiche enterprise se non servono all'evento.
- Tabelle semplici, leggibili e facili da modificare.
- Pagine pubbliche collegate direttamente ai dati Supabase.
- Admin funzionante dal browser.
- Storage Supabase con bucket semplici.
- Nessun segreto nel frontend o nel repository.
- `.env.local` solo locale e ignorato da Git.

## 3. Configurazione Supabase

Il frontend usa solo:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Queste variabili devono essere presenti:

- nel file locale `.env.local`;
- nelle Environment Variables del progetto Vercel.

Non devono mai essere committate chiavi reali.

## 4. Database Semplice

Il database deve contenere solo le tabelle necessarie per far funzionare app pubblica, CMS e gioco.

Tutte le tabelle usano:

- `id uuid primary key default gen_random_uuid()`;
- `created_at timestamptz default now()`;
- `updated_at timestamptz default now()` dove serve modifica.

Il gioco resta una funzione separata dai contenuti delle cantine.

## 5. Tabelle Contenuti

### event_settings

Contiene i dati generali dell'evento.

Campi:

- `id uuid primary key`
- `name text not null`
- `description text`
- `start_date date`
- `end_date date`
- `logo_url text`
- `cover_url text`
- `email text`
- `phone text`
- `website text`
- `instagram text`
- `facebook text`
- `address text`
- `city text`
- `province text`
- `updated_at timestamptz`

Uso:

- Home;
- informazioni;
- footer;
- impostazioni admin.

### wineries

Cantine partecipanti.

Campi:

- `id uuid primary key`
- `name text not null`
- `slug text unique`
- `short_description text`
- `description text`
- `logo_url text`
- `cover_image_url text`
- `gallery_urls text[] default '{}'`
- `address text`
- `latitude numeric`
- `longitude numeric`
- `phone text`
- `email text`
- `website text`
- `facebook text`
- `instagram text`
- `opening_hours text`
- `tastings text`
- `display_order integer default 0`
- `published boolean default false`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- lista cantine;
- dettaglio cantina;
- admin cantine;
- mappa, se una cantina ha coordinate.

### program_items

Programma dell'evento.

Campi:

- `id uuid primary key`
- `title text not null`
- `slug text unique`
- `description text`
- `event_date date`
- `event_time text`
- `location text`
- `category text`
- `image_url text`
- `winery_id uuid references wineries(id) on delete set null`
- `published boolean default false`
- `display_order integer default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- programma pubblico;
- dettaglio evento;
- admin programma.

### news

Comunicazioni e aggiornamenti.

Campi:

- `id uuid primary key`
- `title text not null`
- `slug text unique`
- `cover_url text`
- `content text`
- `published_date date`
- `published boolean default false`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- lista news;
- dettaglio news;
- admin news.

### sponsors

Sponsor e partner.

Campi:

- `id uuid primary key`
- `name text not null`
- `logo_url text`
- `link_url text`
- `category text`
- `display_order integer default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- pagina sponsor;
- admin sponsor.

### map_points

Punti della mappa.

Campi:

- `id uuid primary key`
- `name text not null`
- `category text`
- `description text`
- `latitude numeric`
- `longitude numeric`
- `icon text`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- mappa pubblica;
- admin punti mappa.

Categorie consigliate:

- cantina;
- parcheggio;
- bagno;
- info point;
- food;
- palco;
- primo soccorso;
- accessibilità;
- altro.

## 6. Tabelle Gioco

Il gioco è indipendente dalle cantine.

Non richiede email.

Non richiede password.

Non richiede Supabase Auth per i visitatori.

### players

Rappresenta un dispositivo anonimo che gioca.

Campi:

- `id uuid primary key`
- `device_id text not null unique`
- `nickname text not null`
- `created_at timestamptz default now()`
- `updated_at timestamptz`

Regole:

- il nickname non deve essere univoco;
- `device_id` viene generato automaticamente dal frontend e salvato nel browser;
- lo stesso dispositivo mantiene lo stesso `device_id`;
- se l'utente cambia nickname, si aggiorna il record player.

### scores

Ogni partita genera un nuovo punteggio.

Campi:

- `id uuid primary key`
- `player_id uuid references players(id) on delete cascade`
- `nickname text not null`
- `device_id text not null`
- `score integer not null default 0`
- `played_at timestamptz default now()`

Regole:

- salvare tutti i tentativi;
- lo stesso dispositivo può giocare più volte;
- l'admin può vedere tutti i tentativi;
- la classifica pubblica mostra solo il miglior punteggio per dispositivo.

Vista consigliata:

### leaderboard

Vista semplice basata su `scores`.

Scopo:

- mostrare un solo record per dispositivo;
- tenere il punteggio migliore;
- ordinare per punteggio decrescente;
- usare `played_at` come criterio secondario.

Logica:

```sql
select distinct on (device_id)
  device_id,
  nickname,
  score,
  played_at
from scores
order by device_id, score desc, played_at asc;
```

La query pubblica finale ordina la vista per `score desc`.

### rewards

Premi configurabili.

Campi:

- `id uuid primary key`
- `name text not null`
- `description text`
- `points_required integer not null default 0`
- `image_url text`
- `available boolean default true`
- `created_at timestamptz`
- `updated_at timestamptz`

Uso:

- pagina premi futura;
- admin premi;
- messaggio vincita nel gioco.

### settings

Impostazioni semplici dell'app e del gioco.

Campi:

- `id uuid primary key`
- `key text not null unique`
- `value jsonb not null`
- `updated_at timestamptz`

Chiavi iniziali:

- `game_open`: boolean;
- `min_score_to_win`: number;
- `game_message`: string;
- `maintenance_message`: string opzionale;
- `home_notice`: string opzionale.

## 7. Storage Supabase

Bucket semplici:

- `wineries`
- `news`
- `sponsors`
- `event`
- `rewards`

Regole pratiche:

- usare bucket pubblici per immagini che devono apparire nella web app;
- salvare nei record solo gli URL pubblici o il path trasformabile in URL;
- evitare video pesanti;
- comprimere immagini prima o durante upload;
- usare nomi file semplici e cartelle leggibili.

Esempi:

- `wineries/{winery-id}/cover.webp`
- `wineries/{winery-id}/gallery-1.webp`
- `news/{news-id}/cover.webp`
- `sponsors/{sponsor-id}/logo.webp`
- `event/logo.webp`
- `rewards/{reward-id}/image.webp`

## 8. Admin CMS

Il pannello admin esistente deve diventare un CMS funzionante, ma semplice.

Autenticazione admin:

- usare una soluzione minima e sicura;
- preferibile Supabase Auth solo per amministratori;
- niente registrazione pubblica utenti;
- niente gestione ruoli complessa nella prima versione;
- se c'è un solo amministratore, basta proteggere `/admin` con login.

Sezioni admin:

### Dashboard

- riepilogo contenuti;
- stato gioco aperto/chiuso;
- numero tentativi gioco;
- miglior punteggio;
- link rapidi per modificare contenuti.

### Impostazioni evento

- modifica nome;
- descrizione;
- date;
- logo;
- copertina;
- contatti;
- social;
- indirizzo.

### Cantine

- lista;
- crea;
- modifica;
- elimina;
- upload logo;
- upload cover;
- upload gallery;
- pubblicata sì/no;
- ordine visualizzazione.

### Programma

- lista;
- crea;
- modifica;
- elimina;
- pubblicato sì/no;
- cantina collegata opzionale;
- immagine.

### News

- lista;
- crea;
- modifica;
- elimina;
- copertina;
- pubblicata sì/no.

### Sponsor

- lista;
- crea;
- modifica;
- elimina;
- logo;
- categoria;
- ordine.

### Punti Mappa

- lista;
- crea;
- modifica;
- elimina;
- coordinate;
- categoria;
- icona.

### Gioco

- aprire o chiudere il gioco;
- modificare punteggio minimo per vincere;
- modificare messaggio del gioco;
- vedere classifica;
- vedere tutti i tentativi;
- eliminare punteggi;
- esportare classifica CSV.

### Premi

- lista premi;
- crea premio;
- modifica premio;
- elimina premio;
- carica immagine;
- disponibile sì/no;
- punti richiesti.

## 9. Gioco

Funzionamento pubblico:

1. L'utente apre `/gioca`.
2. Inserisce solo un nickname.
3. Se il browser non ha ancora un `device_id`, il frontend lo genera.
4. Il frontend salva `device_id` in `localStorage`.
5. Il backend crea o aggiorna il record in `players`.
6. Ogni partita genera un record in `scores`.
7. Il backend salva punteggio, nickname, `device_id` e data.
8. La classifica mostra il miglior punteggio per dispositivo.
9. Lo stesso dispositivo può giocare più volte.
10. L'admin può vedere tutti i tentativi.

Regole:

- nickname non univoco;
- nessuna email;
- nessuna password;
- nessun collegamento obbligatorio con cantine;
- punteggio migliore per dispositivo in classifica;
- tutti i tentativi visibili in admin;
- gioco disattivabile da admin tramite `settings.game_open`.

## 10. Classifica

La classifica pubblica mostra:

- posizione;
- nickname;
- punti;
- data del punteggio.

Regole:

- ordinare per punteggio decrescente;
- mostrare solo il miglior punteggio per `device_id`;
- in caso di pari punti, vince chi ha fatto il punteggio prima;
- limitare la classifica pubblica ai primi 50 o 100 record.

L'admin vede:

- tutti i punteggi;
- nickname;
- device anonimo;
- data partita;
- possibilità di eliminare tentativi;
- esportazione CSV.

## 11. Sicurezza Semplice

Lettura pubblica:

- `event_settings`;
- cantine pubblicate;
- programma pubblicato;
- news pubblicate;
- sponsor;
- punti mappa;
- premi disponibili;
- classifica aggregata.

Scrittura pubblica:

- creare/aggiornare `players`;
- creare `scores`.

Scrittura admin:

- gestione contenuti;
- gestione premi;
- gestione settings;
- eliminazione punteggi.

Note:

- evitare service role nel frontend;
- non salvare dati personali sensibili;
- `device_id` è anonimo e generato localmente;
- evitare log inutili;
- proteggere admin con login.

## 12. Collegamento Frontend ai Dati Reali

Le pagine pubbliche devono leggere Supabase:

- Home: `event_settings`, news principali, programma in evidenza;
- Cantine: `wineries` con `published = true`;
- Dettaglio cantina: `wineries.slug`;
- Programma: `program_items` con `published = true`;
- Dettaglio evento: `program_items.slug`;
- News: `news` con `published = true`;
- Dettaglio news: `news.slug`;
- Sponsor: `sponsors`;
- Mappa: `map_points`;
- Gioca: `players`, `scores`, `settings`;
- Classifica: vista `leaderboard` o query equivalente;
- Premi: `rewards` con `available = true`.

I dati demo possono restare come fallback temporaneo durante lo sviluppo, ma l'obiettivo è sostituirli progressivamente.

## 13. Step di Sviluppo

### Step 1: Database e Storage

Obiettivo:

- creare tabelle minime;
- creare bucket Storage;
- inserire pochi dati di test;
- verificare lettura dal frontend.

Output:

- tabelle Supabase;
- bucket immagini;
- dati test.

### Step 2: Servizi Supabase nel frontend

Obiettivo:

- sostituire letture demo con letture Supabase;
- mantenere fallback semplice;
- gestire loading, vuoto ed errore.

Output:

- servizi contenuto reali;
- pagine pubbliche collegate.

### Step 3: Admin contenuti

Obiettivo:

- CMS per evento, cantine, programma, news, sponsor e mappa;
- upload immagini;
- pubblicazione sì/no.

Output:

- admin funzionante per contenuti principali.

### Step 4: Gioco e classifica

Obiettivo:

- nickname;
- device anonimo;
- salvataggio punteggi;
- classifica miglior punteggio;
- admin tentativi.

Output:

- gioco collegato a Supabase;
- classifica pubblica;
- tentativi in admin.

### Step 5: Premi e impostazioni

Obiettivo:

- admin premi;
- punteggio minimo;
- gioco aperto/chiuso;
- messaggi gioco.

Output:

- premi gestibili;
- impostazioni gioco reali.

### Step 6: Pulizia finale

Obiettivo:

- togliere dipendenze da dati demo dove non servono più;
- testare mobile;
- verificare Vercel;
- controllare flusso admin completo.

Output:

- web app pronta per uso evento.

## 14. Analisi del Progetto Attuale

Esiste già:

- React + Vite + TypeScript;
- routing pubblico e admin;
- layout mobile-first;
- pagine pubbliche principali;
- pagina gioco;
- pannello admin mock;
- client Supabase predisposto;
- dati demo;
- mappa Leaflet;
- upload non ancora implementato;
- Storage non ancora collegato;
- CMS reale non ancora implementato.

Da mantenere:

- struttura mobile-first;
- route esistenti;
- stile grafico;
- componenti principali;
- gioco come base visuale;
- admin layout come base CMS.

Da semplificare:

- niente registrazione visitatore;
- niente badge nella prima versione;
- niente ruoli complessi nella prima versione;
- niente migrazioni CLI obbligatorie;
- niente sistema enterprise di audit log.

Da realizzare:

- tabelle reali Supabase;
- Storage bucket;
- servizi frontend reali;
- CMS admin funzionante;
- salvataggio punteggi;
- classifica;
- premi;
- impostazioni gioco.

## 15. Decisioni Aperte

- Login admin: singolo account o più account?
- La classifica pubblica deve mostrare top 50 o top 100?
- Il nickname può essere modificato a ogni partita o resta quello dell'ultimo accesso?
- Il premio viene assegnato automaticamente al superamento soglia o solo mostrato come messaggio?
- Serve esportazione CSV solo classifica o anche tutti i tentativi?
- Le immagini vanno caricate già compresse o compresse prima dell'upload?
- Serve una pagina premi pubblica separata o basta mostrarli nella pagina gioco?
- Per admin, eliminazione definitiva o conferma con soft delete?

## 16. Regola Finale

Ogni nuova scelta tecnica deve rispettare questa priorità:

1. funziona durante l'evento;
2. è semplice da capire;
3. è veloce da mantenere;
4. non espone segreti;
5. non crea complessità non necessaria.
