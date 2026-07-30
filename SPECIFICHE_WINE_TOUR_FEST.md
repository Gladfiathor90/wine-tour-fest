# Specifiche Tecniche Wine Tour Fest

Documento guida per lo sviluppo della web app Wine Tour Fest.

Stato analizzato: progetto React + Vite + TypeScript esistente, repository GitHub `Gladfiathor90/wine-tour-fest`, frontend pubblicato su Vercel, integrazione Supabase predisposta lato client ma senza schema database, autenticazione, Storage o pannello admin reale.

## 1. Obiettivo del progetto

Wine Tour Fest è una web app mobile-first dedicata alla gestione e alla fruizione di un evento enogastronomico diffuso. L'esperienza principale è pensata per smartphone durante l'evento: consultazione rapida, navigazione touch, mappe, programma, QR Code e contenuti aggiornabili.

La web app deve permettere ai visitatori di:

- consultare le cantine partecipanti;
- consultare il programma;
- visualizzare news, avvisi e comunicazioni;
- esplorare la mappa dell'evento;
- salvare elementi preferiti;
- partecipare al gioco tramite QR Code;
- accumulare punti e badge;
- consultare sponsor, informazioni utili, privacy e contatti.

La web app deve inoltre permettere agli amministratori di gestire tutti i contenuti senza modificare il codice, tramite un CMS interno collegato a Supabase.

## 2. Principi architetturali

- Frontend: React + Vite + TypeScript.
- Hosting frontend: Vercel, con fallback SPA verso `index.html`.
- Repository: GitHub `Gladfiathor90/wine-tour-fest`.
- Backend: Supabase.
- Database: PostgreSQL gestito da Supabase.
- Autenticazione: Supabase Auth.
- Storage: Supabase Storage per immagini, documenti, media e asset QR.
- Sicurezza dati: Row Level Security attiva su tutte le tabelle non puramente pubbliche.
- Layout: mobile-first, singola colonna, max-width app circa 430-480 px, bottom navigation sempre presente.
- Caricamento progressivo: route pesanti caricabili in lazy loading, già applicato alla mappa.
- Immagini: ottimizzate, responsive, preferibilmente WebP, con dimensioni e alt text gestiti nella Media Library.
- Separazione domini: contenuti pubblici, utenti, gioco, configurazione, media e log devono avere tabelle e servizi separati.
- Nessun segreto nel frontend: usare solo `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Sviluppo database: migrazioni SQL versionate in `supabase/migrations`, seed separati, nessuna modifica manuale non documentata in produzione.

## 3. Ruoli utente

### Visitatore anonimo

- Vede: Home, cantine pubblicate, programma pubblicato, news pubblicate, mappa, sponsor, informazioni, gastronomia, privacy, 404.
- Crea: nessun dato persistente server-side.
- Modifica: solo preferenze locali eventuali, se previste in futuro.
- Elimina: nessun dato server-side.
- Admin: nessun accesso.
- Dati utenti: nessun accesso.
- Gioco QR: può aprire scanner; l'assegnazione punti definitiva dovrebbe richiedere registrazione o modalità ospite controllata.

### Visitatore registrato

- Vede: contenuti pubblici e propria area profilo.
- Crea: preferiti, scansioni QR valide, richieste riscatto premi.
- Modifica: proprio profilo, preferiti, consensi.
- Elimina: propri preferiti, richiesta cancellazione account.
- Admin: nessun accesso.
- Dati utenti: solo propri dati.
- Gioco QR: accesso completo a scansioni, punti, badge, classifica secondo regole privacy.

### Editor

- Vede: pannello admin limitato ai contenuti assegnati.
- Crea: cantine, programma, news, sponsor, mappa, media secondo permessi.
- Modifica: contenuti assegnati o del proprio ambito.
- Elimina: preferibilmente soft delete o richiesta approvazione.
- Admin: accesso parziale.
- Dati utenti: nessun accesso ai dati personali salvo statistiche aggregate.
- Gioco QR: solo lettura configurazioni se autorizzato.

### Amministratore

- Vede: tutto il CMS, contenuti, media, utenti registrati, scansioni e log essenziali.
- Crea: tutti i contenuti, QR Code, premi, impostazioni.
- Modifica: tutti i contenuti e configurazioni operative.
- Elimina: contenuti, media non usati, premi e QR non critici con conferme.
- Admin: accesso completo operativo.
- Dati utenti: accesso controllato e tracciato.
- Gioco QR: gestione QR, punti configurabili, badge e premi.

### Super amministratore

- Vede: tutto, inclusi log attività e configurazioni critiche.
- Crea: ruoli, amministratori, impostazioni globali.
- Modifica: ruoli, permessi, policy applicative, impostazioni evento.
- Elimina: con limiti e audit log; azioni irreversibili sempre confermate.
- Admin: accesso completo.
- Dati utenti: accesso completo solo per finalità operative e GDPR.
- Gioco QR: controllo completo, incluse correzioni manuali tracciate.

## 4. Moduli pubblici

### Home

Attuale: pagina pubblica con brand identity 2026, date, CTA verso programma, cantine, mappa, gastronomia, gioco e footer. Usa dati demo da `generalInfo`.

Futuro: contenuti gestiti da `settings` e sezioni editoriali configurabili; eventuale stato manutenzione o messaggi urgenti.

### Cantine

Attuale: lista cantine demo con ricerca e filtri "Tutte", "Aperte ora", "Con eventi".

Futuro: lista da Supabase, ricerca server-side o client-side su dataset filtrato, paginazione se necessaria, preferiti, stato pubblicazione e ordinamento.

### Dettaglio cantina

Attuale: scheda con cover, logo, contatti, descrizione espandibile, galleria, eventi collegati, QR informativo e condivisione.

Futuro: contenuti completi da `wineries`, `winery_images`, `winery_products`, `winery_tastings`, preferiti, QR associato e analytics scansioni.

### Programma

Attuale: programma musicale demo raggruppato per data, filtro categoria, stile grafico coerente con brand.

Futuro: lettura da `program_items`, categorie gestite in `program_categories`, preferiti, evidenze, stato live/annullato e ordinamento.

### Dettaglio evento

Attuale: immagine, titolo, descrizione, data, orari, luogo, cantina associata opzionale, QR informativo e share.

Futuro: salvataggio preferiti, coordinate, speaker/artista, booking esterno, stato evento e SEO base.

### News

Attuale: lista news demo ordinate per data.

Futuro: news pubblicate da Supabase, tag, contenuti in evidenza, avvisi urgenti, paginazione.

### Dettaglio news

Attuale: copertina, titolo, autore, contenuto, importante, share.

Futuro: gallery, SEO base, tag, autore collegato a profilo admin.

### Mappa

Attuale: Leaflet con OpenStreetMap, punti demo filtrabili per categoria, popup e card con indicazioni.

Futuro: punti da `points_of_interest`, categorie configurabili, stato, orari, icone, aree accessibili, eventuale fallback offline leggero.

### Sponsor

Attuale: sponsor demo raggruppati per livello con logo e link.

Futuro: categorie sponsor, sponsor principali, tracciamento click opzionale e ordinamento CMS.

### Informazioni

Attuale: informazioni utili demo da `generalInfo`.

Futuro: blocchi gestiti da admin, messaggi di servizio, contatti, social, FAQ e accessibilità.

### Preferiti

Attuale: non presente come route dedicata e non persistito.

Futuro: salvataggio di cantine, eventi e news per utenti registrati nella tabella `favorites`; eventuale fallback locale per anonimi da valutare.

### Gioco

Attuale: mini gioco locale "Acchiappa il Calice", record e codice premio salvati in `localStorage`, nessuna validazione server-side.

Futuro: gioco QR con scansioni reali, punti, badge, classifica, premi e protezione anti-abuso tramite Supabase.

### Profilo utente

Attuale: non presente.

Futuro: profilo personale, punti, badge, preferiti, cronologia scansioni, premi, consensi e cancellazione account.

### Login e registrazione

Attuale: pagina admin login demo; nessuna autenticazione reale.

Futuro: Supabase Auth per visitatori e admin, conferma email, recupero password e sessione persistente.

### Classifica

Attuale: non presente.

Futuro: classifica utenti opt-in, per punti totali o periodo, con privacy configurabile.

### Premi

Attuale: codice premio locale nel mini gioco.

Futuro: premi configurati in `rewards`, riscatti in `reward_redemptions`, QR o codice univoco di riscatto.

### Pagina 404

Attuale: presente con `NotFoundPage`, messaggio e ritorno alla Home.

Futuro: mantenere, aggiungendo eventuali link rapidi a Home, Programma e Mappa.

### Stati di caricamento

Attuale: fallback testuale per lazy loading della mappa.

Futuro: skeleton mobile coerenti per liste, dettagli, mappa e admin.

### Stati vuoti

Attuale: componente `EmptyState` usato in dettagli non trovati e 404.

Futuro: stati vuoti per ricerca senza risultati, preferiti vuoti, nessun premio, nessuna scansione.

### Gestione errori

Attuale: fallback ai dati demo in caso di errore Supabase nei servizi `readWithFallback`.

Futuro: error boundary, messaggi utente chiari, retry, logging tecnico e tracciamento errori.

## 5. Pannello amministrativo

Il CMS interno deve evolvere dalle pagine mock attuali verso un pannello reale protetto da Supabase Auth e ruoli.

### Dashboard

- Elenco contenuti: riepilogo cantine, programma, news, sponsor, bozze, scansioni, utenti e premi.
- Ricerca: globale sui contenuti principali.
- Filtri: periodo, stato contenuti, tipo entità.
- Ordinamento: ultimi aggiornamenti, priorità, stato.
- Creazione: CTA rapide per cantina, programma, news e sponsor.
- Modifica: link diretti alle entità.
- Eliminazione: non direttamente dalla dashboard.
- Pubblicazione/bozza: evidenza contenuti in bozza.
- Immagini: riepilogo media recenti.
- Anteprima: link alle pagine pubbliche.
- Conferme: per azioni massive.
- Messaggi: toast successo/errore.

### Evento

Gestione impostazioni generali dell'edizione: nome, date, luogo, descrizione, contatti, social, stato evento, brand assets.

### Cantine

Lista con ricerca, filtri per pubblicazione, in evidenza, servizi, accessibilità e stato QR; ordinamento manuale; creazione/modifica completa; caricamento logo, cover e gallery; anteprima pubblica; conferma eliminazione; soft delete consigliato.

### Programma

Lista eventi con filtri per data, categoria, luogo, stato e in evidenza; ordinamento per data/ora e ordine manuale; creazione/modifica; immagine; anteprima dettaglio; bozza/pubblicato/annullato.

### News

Lista news con ricerca, filtri per stato, tag, importante, autore; creazione/modifica rich text; gallery; anteprima; programmazione pubblicazione; bozza/pubblicata/archiviata.

### Sponsor

Lista per categoria/livello, ordine e stato; caricamento logo; link esterno; sponsor principale; tracciamento click opzionale.

### Mappa e punti di interesse

Lista punti con ricerca e filtri categoria/stato; inserimento coordinate manuale o da mappa; icone configurabili; anteprima mappa; pubblicazione.

### Gioco QR

Gestione QR, regole punteggio, validità, limiti scansione, badge, classifica, premi e riscatti. Ogni modifica critica deve generare log.

### Premi

Catalogo premi con quantità, soglia punti, disponibilità, periodo validità, istruzioni riscatto, stato e storico riscatti.

### Utenti

Lista utenti registrati, ricerca, filtri per ruolo/stato/punti, profilo, badge, scansioni, premi. Modifiche punti solo tramite transazioni tracciate.

### Media Library

Caricamento multiplo, ricerca, filtri, anteprima, alt text, compressione e controllo file usati.

### Impostazioni

Logo, favicon, colori tema, testi footer, link privacy/cookie, gioco attivo, registrazioni attive, messaggi di servizio, manutenzione.

### Log attività

Elenco audit log filtrabile per utente, azione, entità, data e severità; nessuna modifica diretta ai log.

## 6. Database

Convenzioni generali:

- `id uuid primary key default gen_random_uuid()`.
- `created_at timestamptz not null default now()`.
- `updated_at timestamptz not null default now()`.
- `status text not null default 'draft'` dove serve pubblicazione.
- `display_order integer not null default 0` dove serve ordinamento.
- `slug text unique` per entità pubbliche.
- Indici su slug, stato, date, foreign key, coordinate e campi usati in filtri.
- Soft delete opzionale con `deleted_at timestamptz`.

### profiles

Descrizione: profili utente collegati a Supabase Auth.

Campi: `id uuid pk fk auth.users(id)`, `display_name text`, `full_name text`, `avatar_media_id uuid fk media(id)`, `phone text`, `points_balance integer default 0`, `privacy_accepted_at timestamptz`, `marketing_accepted_at timestamptz`, `status text default 'active'`, timestamp.

Indici: `status`, `points_balance desc`.

Vincoli: punti non negativi.

### user_roles

Campi: `id uuid pk`, `user_id uuid fk profiles(id)`, `role text`, `created_by uuid fk profiles(id)`, timestamp.

Vincoli: unique `user_id, role`; ruolo tra `visitor`, `editor`, `admin`, `super_admin`.

### events

Tabella evento/edizione generale. Campi: `id`, `name`, `slug`, `edition`, `description`, `start_date date`, `end_date date`, `city`, `province`, `main_venue`, `cover_media_id`, `logo_media_id`, `status`, `display_order`, timestamp.

### wineries

Campi: `id`, `name`, `slug`, `logo_media_id`, `cover_media_id`, `short_description`, `description`, `history`, `address`, `city`, `province`, `latitude numeric(10,7)`, `longitude numeric(10,7)`, `phone`, `email`, `website`, `instagram`, `facebook`, `opening_hours jsonb`, `services text[]`, `accessibility text`, `featured boolean default false`, `published boolean default false`, `status`, `display_order`, `qr_code_id uuid fk qr_codes(id)`, timestamp.

Indici: slug, published/status, featured, coordinate.

### winery_images

Campi: `id`, `winery_id fk wineries(id)`, `media_id fk media(id)`, `alt_text`, `caption`, `display_order`, `status`, timestamp.

Vincoli: unique `winery_id, media_id`.

### winery_products

Campi: `id`, `winery_id`, `name`, `category`, `description`, `year`, `image_media_id`, `display_order`, `status`, timestamp.

### winery_tastings

Campi: `id`, `winery_id`, `title`, `description`, `start_time`, `end_time`, `price numeric`, `capacity integer`, `booking_required boolean`, `status`, `display_order`, timestamp.

### program_items

Campi: `id`, `title`, `slug`, `description`, `short_description`, `event_date date`, `start_time time`, `end_time time`, `location`, `latitude`, `longitude`, `category_id fk program_categories(id)`, `artist_or_guest`, `image_media_id`, `winery_id fk wineries(id)`, `featured boolean`, `status`, `display_order`, timestamp.

Indici: date/time, slug, category, status.

### program_categories

Campi: `id`, `name`, `slug`, `color`, `icon`, `display_order`, `status`, timestamp.

### news

Campi: `id`, `title`, `slug`, `excerpt`, `content`, `cover_media_id`, `author_id fk profiles(id)`, `published_at timestamptz`, `status`, `featured boolean`, `tags text[]`, `seo_title`, `seo_description`, `display_order`, timestamp.

### news_images

Campi: `id`, `news_id fk news(id)`, `media_id fk media(id)`, `alt_text`, `caption`, `display_order`, timestamp.

### sponsors

Campi: `id`, `name`, `slug`, `logo_media_id`, `website`, `description`, `category_id fk sponsor_categories(id)`, `display_order`, `status`, `main_sponsor boolean default false`, `track_clicks boolean default false`, timestamp.

### sponsor_categories

Campi: `id`, `name`, `slug`, `level`, `display_order`, `status`, timestamp.

### points_of_interest

Campi: `id`, `name`, `slug`, `description`, `category`, `address`, `latitude`, `longitude`, `icon`, `image_media_id`, `opening_hours jsonb`, `winery_id fk wineries(id)`, `status`, `display_order`, timestamp.

Categorie iniziali: `winery`, `parking`, `toilet`, `info_point`, `food`, `stage`, `first_aid`, `accessible_area`, `shuttle`, `custom`.

### favorites

Campi: `id`, `user_id fk profiles(id)`, `target_type text`, `target_id uuid`, timestamp.

Vincoli: unique `user_id, target_type, target_id`; target type tra `winery`, `program_item`, `news`.

### media

Campi: `id`, `file_name`, `title`, `alt_text`, `description`, `mime_type`, `size_bytes bigint`, `url`, `storage_bucket`, `storage_path`, `folder`, `uploaded_by fk profiles(id)`, `checksum`, `width`, `height`, `status`, timestamp.

Indici: bucket/path, folder, mime, checksum.

### qr_codes

Campi: `id`, `code text unique`, `target_type`, `target_id uuid`, `points integer default 0`, `active boolean default true`, `valid_from`, `valid_until`, `max_total_uses integer`, `max_uses_per_user integer default 1`, `metadata jsonb`, timestamp.

### qr_scans

Campi: `id`, `qr_code_id fk qr_codes(id)`, `user_id fk profiles(id)`, `scanned_at timestamptz default now()`, `ip_hash text`, `user_agent text`, `status text`, `points_awarded integer default 0`, `failure_reason text`.

Vincoli: unique parziale per bloccare duplicate valide per utente/codice.

### points_transactions

Campi: `id`, `user_id fk profiles(id)`, `source_type`, `source_id uuid`, `points integer`, `reason`, `created_by uuid`, timestamp.

Vincoli: modifiche saldo tramite funzione sicura; no update/delete ordinari.

### badges

Campi: `id`, `name`, `slug`, `description`, `icon_media_id`, `rule_type`, `rule_config jsonb`, `points_bonus integer default 0`, `status`, timestamp.

### user_badges

Campi: `id`, `user_id`, `badge_id`, `earned_at`, `source_id`, timestamp.

Vincoli: unique `user_id, badge_id`.

### rewards

Campi: `id`, `name`, `slug`, `description`, `image_media_id`, `points_required`, `quantity_total`, `quantity_remaining`, `valid_from`, `valid_until`, `instructions`, `status`, timestamp.

### reward_redemptions

Campi: `id`, `reward_id`, `user_id`, `points_spent`, `code text unique`, `status`, `requested_at`, `redeemed_at`, `redeemed_by`, timestamp.

### settings

Campi: `id`, `key text unique`, `value jsonb`, `scope text default 'global'`, `updated_by`, timestamp.

### activity_logs

Campi: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before_data jsonb`, `after_data jsonb`, `ip_hash`, `created_at`.

Ulteriori tabelle consigliate: `program_locations`, `consents`, `sponsor_clicks`, `admin_invitations`, `app_notifications`, `maintenance_windows`.

## 7. Cantine

Dati gestibili per ogni cantina:

- nome;
- slug;
- logo;
- cover;
- descrizione breve;
- descrizione completa;
- storia;
- indirizzo;
- coordinate;
- telefono;
- email;
- sito;
- Instagram;
- Facebook;
- orari;
- servizi;
- accessibilità;
- degustazioni;
- vini;
- prodotti;
- galleria;
- video embed esterno;
- stato pubblicazione;
- ordine;
- QR associato.

La pagina pubblica deve mostrare solo cantine pubblicate. Il CMS deve permettere bozza, anteprima e controllo completezza dati.

## 8. Programma

Dati gestibili:

- titolo;
- slug;
- descrizione;
- data;
- ora inizio;
- ora fine;
- luogo;
- coordinate;
- categoria;
- artista, relatore o ospite;
- immagine;
- stato;
- evento in evidenza;
- ordine;
- possibilità di salvataggio nei preferiti.

Stati consigliati: `draft`, `published`, `scheduled`, `live`, `finished`, `cancelled`, `archived`.

## 9. News

Dati gestibili:

- titolo;
- slug;
- estratto;
- contenuto;
- copertina;
- galleria;
- autore;
- data pubblicazione;
- stato bozza/pubblicata;
- contenuto in evidenza;
- tag;
- SEO base.

La pubblicazione può essere immediata o programmata. Le news importanti possono comparire in Home e sopra il programma.

## 10. Sponsor

Dati gestibili:

- nome;
- logo;
- link;
- descrizione;
- categoria;
- ordine;
- stato;
- sponsor principale;
- tracciamento click opzionale.

Lo sponsor può essere pubblico solo se `status = published` e se il logo ha alt text.

## 11. Mappa

Categorie previste:

- cantine;
- parcheggi;
- bagni;
- info point;
- stand gastronomici;
- palchi;
- punti di primo soccorso;
- aree accessibili;
- altre categorie configurabili.

Per ogni punto:

- nome;
- descrizione;
- categoria;
- latitudine;
- longitudine;
- icona;
- immagine;
- orari;
- stato.

La mappa deve mantenere performance buone su smartphone. Se i punti crescono, valutare clustering o caricamento per area.

## 12. Media Library

Ogni file deve avere:

- nome file;
- titolo;
- testo alternativo;
- descrizione;
- tipo MIME;
- dimensione;
- URL pubblico o firmato;
- percorso Storage;
- cartella logica;
- autore caricamento;
- data caricamento;
- utilizzi associati.

Funzioni:

- ricerca;
- filtri;
- anteprima;
- caricamento multiplo;
- eliminazione sicura;
- rilevamento file già utilizzati;
- prevenzione duplicati tramite checksum;
- conversione o richiesta WebP;
- limiti dimensione;
- compressione.

## 13. Storage Supabase

Bucket consigliati:

- `public-media`: immagini pubbliche per cantine, programma, news, sponsor, brand.
- `private-media`: documenti o file admin non pubblici.
- `qr-assets`: immagini QR generate o asset tecnici QR.
- `documents`: regolamenti, PDF, materiali scaricabili.

Cartelle logiche:

- `event`;
- `wineries`;
- `program`;
- `news`;
- `sponsors`;
- `users`;
- `rewards`;
- `gallery`.

Pubblici: loghi, cover, gallery pubblicate, immagini programma, sponsor, documenti pubblici.

Privati: documenti admin, eventuali avatar non pubblici, export utenti, file premio o report.

## 14. Autenticazione

Flussi necessari:

- registrazione visitatore;
- login;
- logout;
- recupero password;
- conferma email;
- sessione persistente;
- profilo utente;
- eliminazione account;
- gestione ruoli;
- protezione route admin;
- gestione sessione scaduta.

Supabase Auth deve essere la fonte identità. La tabella `profiles` estende `auth.users`; i ruoli applicativi stanno in `user_roles`.

## 15. Sicurezza e RLS

Policy minime:

- contenuti pubblicati leggibili da tutti;
- bozze visibili solo a editor/admin autorizzati;
- utenti modificano solo il proprio profilo;
- preferiti modificabili solo dal proprietario;
- scansioni QR associate solo all'utente autenticato;
- nessun utente può modificare direttamente il proprio punteggio;
- punti assegnati tramite funzione sicura o procedura server-side;
- amministratori autorizzati tramite ruoli;
- service role mai esposta nel frontend;
- log delle operazioni amministrative.

Funzioni server-side consigliate:

- `scan_qr_code(code text)`;
- `award_points(user_id uuid, points integer, source_type text, source_id uuid)`;
- `redeem_reward(reward_id uuid)`;
- `recalculate_badges(user_id uuid)`.

## 16. Gioco QR

Flusso:

1. L'utente accede o si registra.
2. Apre lo scanner QR.
3. Scansiona il QR di una cantina o attività.
4. Il codice viene validato.
5. Viene verificato che non sia già stato utilizzato oltre i limiti.
6. Vengono assegnati punti.
7. Viene registrata la transazione.
8. Vengono controllati nuovi badge.
9. Viene aggiornato il profilo.
10. Viene mostrato un messaggio di conferma.

Requisiti:

- QR univoci;
- codici attivi/disattivi;
- data validità;
- limite utilizzo globale e per utente;
- blocco scansioni duplicate;
- protezione contro richieste manuali;
- punti configurabili;
- badge;
- classifica;
- premi;
- riscatto premi;
- log;
- modalità ospite da valutare, ma non deve consentire abuso punti.

Il mini gioco locale attuale può restare come esperienza ludica separata oppure diventare modulo promozionale secondario, ma non deve essere fonte autorevole di punti.

## 17. Preferiti

Gli utenti registrati devono poter salvare:

- cantine;
- eventi;
- news.

Struttura proposta: tabella `favorites` con `target_type` e `target_id`, vincolo unique per impedire duplicati. RLS: ogni utente legge, crea ed elimina solo i propri preferiti.

## 18. Impostazioni globali

Impostazioni gestibili da admin:

- nome evento;
- logo;
- favicon;
- cover;
- descrizione;
- date;
- contatti;
- social;
- indirizzo;
- colori tema;
- testi footer;
- link privacy;
- link cookie;
- stato del gioco;
- stato registrazioni;
- messaggi di servizio;
- modalità manutenzione.

Le impostazioni devono stare in `settings`, con valori JSON validati lato applicazione.

## 19. Prestazioni

- Lazy loading delle route pesanti, come già fatto per `MapPage`.
- Paginazione o infinite scroll per news, sponsor, utenti e log.
- Query selettive: evitare `select('*')` nelle schermate finali.
- Caching client controllato e invalidazione dopo modifiche admin.
- Immagini responsive e WebP.
- Compressione prima dell'upload.
- Evitare video pesanti nello Storage; usare YouTube/Vimeo per video lunghi.
- Indici database su slug, stato, date, foreign key e ricerche frequenti.
- Limitazione richieste su QR e funzioni critiche.
- Monitoraggio Vercel e Supabase per traffico evento.
- Bundle splitting per ridurre il chunk principale, dato che la build segnala chunk oltre 500 kB.

## 20. Accessibilità

- Testo alternativo obbligatorio per immagini editoriali.
- Contrasto adeguato alla palette 2026.
- Dimensioni touch minime 44 px.
- Focus visibile.
- Navigazione da tastiera.
- Etichette form esplicite.
- Errori comprensibili e associati ai campi.
- Supporto `prefers-reduced-motion` per animazioni.
- Compatibilità screen reader per nav, scanner QR, modali e form.

## 21. Privacy e GDPR

- Consenso privacy in registrazione.
- Termini specifici del gioco QR.
- Cookie policy separata se vengono introdotti tracking o analytics non tecnici.
- Minimizzazione dati: salvare solo ciò che serve.
- Esportazione dati utente.
- Eliminazione account.
- Conservazione dati definita per scansioni, log, premi e account.
- Newsletter separata dai consensi del gioco.
- Nessun dato personale nei log pubblici.
- Hash o mascheramento di IP e user agent quando non indispensabili.

## 22. Migrazioni

Strategia:

- creare cartella `supabase/migrations`;
- migrazioni SQL versionate e ordinate per timestamp;
- seed demo separati da migrazioni strutturali;
- ambienti distinti: locale, staging, produzione;
- rollback documentato quando possibile;
- nessuna modifica manuale non documentata al database di produzione;
- ogni cambio RLS deve avere test manuale o automatizzato;
- tipi TypeScript database generati da Supabase CLI quando lo schema sarà stabile.

## 23. Fasi di sviluppo

### Fase 1: database base, Storage e sicurezza

- Obiettivi: schema iniziale, bucket, RLS pubblica/admin base.
- Dipendenze: decisioni su tabelle e ruoli.
- Output: migrazioni, seed demo, policy minime.
- Test: lettura pubblica contenuti pubblicati, blocco bozze.
- Rischi: RLS troppo permissiva o troppo restrittiva.

### Fase 2: autenticazione e ruoli

- Obiettivi: login, registrazione, profilo, ruoli.
- Dipendenze: `profiles`, `user_roles`, policy.
- Output: auth visitor/admin e route protette.
- Test: accessi per ogni ruolo.
- Rischi: escalation privilegi e sessioni scadute non gestite.

### Fase 3: CMS admin per cantine, programma, news e sponsor

- Obiettivi: CRUD reale contenuti principali.
- Dipendenze: auth, media base.
- Output: liste, form, anteprima, bozza/pubblicato.
- Test: creazione, modifica, eliminazione soft, errori.
- Rischi: perdita dati e validazioni incomplete.

### Fase 4: collegamento pagine pubbliche ai dati reali

- Obiettivi: sostituire demo con query Supabase.
- Dipendenze: schema e CMS stabili.
- Output: pagine pubbliche dinamiche.
- Test: stati loading, vuoti, errore, performance mobile.
- Rischi: regressioni UX durante evento.

### Fase 5: Media Library e mappa

- Obiettivi: gestione media centralizzata e punti mappa reali.
- Dipendenze: Storage e media table.
- Output: upload, compressione, alt text, mappa admin.
- Test: upload multiplo, file usati, coordinate.
- Rischi: file pesanti e costi Storage.

### Fase 6: gioco QR, punti, badge e premi

- Obiettivi: scansioni QR reali, transazioni punti, badge, classifica, premi.
- Dipendenze: auth, funzioni sicure, RLS.
- Output: flusso QR end-to-end.
- Test: duplicate, limiti, validità, abuso, riscatto.
- Rischi: frodi, race condition, privacy classifica.

### Fase 7: ottimizzazione, test, accessibilità e produzione

- Obiettivi: stabilità evento, performance, audit accessibilità.
- Dipendenze: funzionalità complete.
- Output: release candidata, checklist operativa.
- Test: mobile widths 360/375/390/430/768, desktop centrato, offline parziale, carico.
- Rischi: traffico di picco, rete mobile instabile, compatibilità scanner.

## 24. Analisi del progetto attuale

### Struttura esistente

- `src/App.tsx`: definizione router React Router.
- `src/pages/public`: pagine pubbliche già presenti.
- `src/pages/admin`: dashboard, login e sezioni admin mock.
- `src/components`: componenti comuni, card contenuto, nav e QR scanner.
- `src/layouts`: layout pubblico e admin mobile-first.
- `src/data/demoData.ts`: dataset statico per cantine, programma, news, sponsor, mappa, gastronomia, impostazioni gioco e sezioni admin.
- `src/services`: servizi contenuto con pattern demo/fallback.
- `src/types/content.ts`: tipi TypeScript di contenuto.
- `src/lib/supabase.ts`: client Supabase tipizzato con variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `src/index.css`: tema 2026, layout mobile-first, nav e animazioni gioco/QR.
- `vercel.json`: configurazione Vercel per SPA Vite.

### Route pubbliche esistenti

- `/`
- `/cantine`
- `/cantine/:slug`
- `/eventi`
- `/eventi/:slug`
- `/news`
- `/news/:slug`
- `/mappa`
- `/informazioni`
- `/sponsor`
- `/gastronomia`
- `/gioca`
- `/menu`
- `/privacy`
- `*` 404

### Route admin esistenti

- `/admin`
- `/admin/login`
- `/admin/cantine`
- `/admin/cantine/nuova`
- `/admin/cantine/:id`
- `/admin/eventi`
- `/admin/eventi/nuovo`
- `/admin/eventi/:id`
- `/admin/news`
- `/admin/news/nuova`
- `/admin/news/:id`
- `/admin/mappa`
- `/admin/sponsor`
- `/admin/informazioni`
- `/admin/gioco`
- `/admin/gastronomia`
- `/admin/impostazioni`

### Già implementato

- Layout mobile-first centrato su max-width 480 px.
- Bottom navigation mobile sempre presente.
- Splash screen con logo.
- Home, cantine, dettaglio cantina, programma, dettaglio evento, news, dettaglio news, mappa, sponsor, informazioni, gastronomia, gioco, menu, privacy, 404.
- QR scanner con `getUserMedia` e `BarcodeDetector` quando supportato.
- QR informativi per cantine ed eventi.
- Mini gioco locale con punteggi, vite, record e codice premio localStorage.
- Admin mock con dashboard, liste e form dimostrativi.
- Client Supabase predisposto e servizi con fallback demo.
- Lazy loading della mappa.

### Solo demo o simulato

- Dati contenuto statici in `demoData.ts`.
- Admin senza salvataggio reale.
- Login admin senza autenticazione reale.
- Supabase senza tabelle tipizzate.
- Gioco premio locale non validato server-side.
- QR informativi non associati a scansioni, punti o badge.
- Preferiti, profilo, classifica e premi reali assenti.

### Mancante

- Schema database.
- Migrazioni Supabase.
- RLS.
- Supabase Auth integrato.
- Storage e Media Library.
- CRUD reale admin.
- Funzioni sicure per QR e punti.
- Classifica, badge e premi server-side.
- Preferiti persistenti.
- Profilo utente.
- Test automatizzati.

### Riutilizzabile

- Router e naming route.
- Layout mobile-first.
- Componenti card e header.
- Modello dati TypeScript come base iniziale.
- Pattern `contentService` e servizi per sostituire demo con query reali.
- Stile 2026 e palette.
- QR scanner come base UI.
- Mappa Leaflet come base.

### Da rifattorizzare

- `readWithFallback` dovrà usare query selettive e tipi database reali.
- `demoList()` nelle pagine pubbliche dovrà diventare hook/query asincrona.
- Admin mock dovrà essere separato in componenti form reali.
- Tipi `Database` in `src/lib/supabase.ts` dovranno essere generati dallo schema Supabase.
- Gioco locale dovrà essere separato dal sistema punti autorevole.

### Rischi tecnici

- Chunk principale sopra 500 kB in build: valutare code splitting.
- `BarcodeDetector` non supportato su tutti i browser: serve fallback o libreria QR dedicata.
- Uso futuro di `select('*')` poco efficiente e da limitare.
- RLS e funzioni punti sono critiche per evitare abuso.
- Coordinate e URL demo devono essere sostituiti con dati validati.
- Assenza test automatici.

### Incongruenze rilevate

- Il CMS admin attuale ha route e campi mock, ma non salva.
- Alcune entità richieste dal prodotto futuro non hanno route dedicate: preferiti, profilo, classifica, premi, login visitatore.
- `events` nel progetto indica il programma, mentre in database può essere utile distinguere `events` come edizione e `program_items` come programma.
- Il mini gioco attuale assegna premio locale ma non ha validazione reale.

## 25. Decisioni aperte

- Registrazione obbligatoria per il gioco QR o modalità ospite?
- Classifica pubblica, privata o opt-in?
- Quantità punti per QR, cantine, eventi e bonus.
- Regole premi: soglie, quantità, validità, riscatto e anti-frode.
- Mappa: continuare con Leaflet/OpenStreetMap, Google Maps o Mapbox?
- Video: upload in Storage o embed esterno YouTube/Vimeo?
- Gestione multievento futura o singola edizione annuale?
- Gestione multilingua italiano/inglese?
- Proprietà finale degli account admin e procedura offboarding.
- Durata conservazione dati per scansioni, log, punti e utenti.
- Necessità newsletter e relativo consenso separato.
- Livello di analytics consentito da privacy/cookie.
- Presenza di staging Vercel/Supabase prima della produzione.
- Strategia backup e restore Supabase durante evento.
- Libreria QR fallback per browser senza `BarcodeDetector`.
