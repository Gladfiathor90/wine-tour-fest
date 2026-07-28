# Wine Tour Fest

Web app informativa mobile-first per consultare cantine, eventi, news, mappa, informazioni utili, sponsor e mini gioco promozionale.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- Supabase JavaScript Client

## Comandi

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Variabili ambiente

Copia `.env.example` in `.env.local` quando saranno disponibili le credenziali reali Supabase.

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

In questa fase Supabase e predisposto ma non collegato a dati reali.

## Route pubbliche

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

## Route admin future

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

## Deploy futuro

Il file `vercel.json` include la configurazione base per una SPA Vite su Vercel, con fallback verso `index.html` per le route React Router.
