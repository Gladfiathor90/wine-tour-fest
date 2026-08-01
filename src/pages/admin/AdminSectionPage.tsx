import { Plus, QrCode, Trash2 } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { adminSections } from '../../data/demoData'
import { contentService } from '../../services/contentService'
import { usePageMeta } from '../../hooks/usePageMeta'
import { adminRoutes, publicRoutes } from '../../utils/routes'

const fieldLabels = {
  cantine: ['Nome', 'Slug', 'Descrizione breve', 'Descrizione completa', 'Indirizzo', 'Citta', 'Telefono', 'Email', 'Sito', 'Instagram', 'Facebook', 'Orari', 'Latitudine', 'Longitudine', 'Pubblicata', 'In evidenza'],
  eventi: ['Titolo', 'Slug', 'Categoria', 'Data inizio', 'Ora inizio', 'Ora fine', 'Luogo', 'Cantina associata', 'Stato evento', 'Prenotazione richiesta', 'Pubblicato'],
  news: ['Titolo', 'Slug', 'Estratto', 'Contenuto', 'Autore', 'Importante', 'Pubblicata'],
  mappa: ['Nome punto', 'Categoria', 'Descrizione', 'Indirizzo', 'Latitudine', 'Longitudine', 'Cantina collegata', 'Attivo'],
  sponsor: ['Nome', 'Logo', 'Sito web', 'Livello', 'Ordine', 'Attivo'],
  informazioni: ['Nome evento', 'Edizione', 'Date', 'Citta', 'Contatti', 'Social', 'Informazioni essenziali'],
  gioco: ['Gioco attivo', 'Durata', 'Vite', 'Punti calice', 'Punti grappolo', 'Punti formaggio', 'Velocita', 'Soglia premio', 'Testo premio', 'Messaggio finale'],
  gastronomia: ['Giorno', 'Mese', 'Anno', 'Piatto 1', 'Piatto 2', 'Nota acqua', 'Prezzo', 'Attivo'],
  impostazioni: ['Stato Supabase', 'Dominio futuro', 'SEO base', 'Favicon', 'Preferenze generali'],
}

function collectionFor(section: string) {
  if (section === 'cantine') return contentService.wineries.demoList().map((item) => ({ id: item.id, title: item.name, subtitle: item.shortDescription, preview: publicRoutes.wineryDetail(item.slug) }))
  if (section === 'eventi') return contentService.events.demoList().map((item) => ({ id: item.id, title: item.title, subtitle: `${item.startDate} ${item.startTime}`, preview: publicRoutes.eventDetail(item.slug) }))
  if (section === 'news') return contentService.news.demoList().map((item) => ({ id: item.id, title: item.title, subtitle: item.excerpt, preview: publicRoutes.newsDetail(item.slug) }))
  if (section === 'mappa') return contentService.mapPoints.demoList().map((item) => ({ id: item.id, title: item.name, subtitle: item.category, preview: publicRoutes.map }))
  if (section === 'sponsor') return contentService.sponsors.demoList().map((item) => ({ id: item.id, title: item.name, subtitle: item.level, preview: publicRoutes.sponsors }))
  if (section === 'gastronomia') return contentService.gastronomy.demoList().map((item) => ({ id: item.id, title: `${item.day} ${item.month}`, subtitle: item.dishes.join(', '), preview: publicRoutes.gastronomy }))
  return []
}

export function AdminSectionPage() {
  const location = useLocation()
  const { id } = useParams()
  const parts = location.pathname.split('/').filter(Boolean)
  const sectionKey = parts[1] as keyof typeof fieldLabels
  const isNew = ['nuova', 'nuovo'].includes(parts[2] ?? '')
  const isForm = isNew || Boolean(id)
  const section = adminSections.find((item) => item.path === `/admin/${sectionKey}`) ?? adminSections.find((item) => item.path === adminRoutes.settings)
  const items = collectionFor(sectionKey)
  const fields = fieldLabels[sectionKey] ?? fieldLabels.impostazioni
  usePageMeta(`Admin ${section?.label ?? 'Impostazioni'}`, section?.description ?? 'Sezione admin Wine Tour Fest.')

  if (isForm || ['informazioni', 'gioco', 'gastronomia', 'impostazioni'].includes(sectionKey)) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Form mock</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">{isNew ? 'Nuovo contenuto' : section?.label}</h1>
          <p className="mt-2 text-sm text-stone-600">Campi predisposti per il futuro salvataggio su Supabase.</p>
        </div>
        <form className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
          {fields.map((field) => (
            <label key={field} className="block text-sm font-semibold text-stone-700">
              {field}
              <input className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" placeholder={field} />
            </label>
          ))}
          <div className="grid gap-3">
            <button type="button" className="min-h-12 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">Salva demo</button>
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-sm font-semibold text-red-700">
              <Trash2 className="h-4 w-4" /> Elimina con conferma
            </button>
          </div>
        </form>
      </div>
    )
  }

  const addPath = sectionKey === 'cantine' ? adminRoutes.newWinery : sectionKey === 'eventi' ? adminRoutes.newEvent : sectionKey === 'news' ? adminRoutes.newNews : `/admin/${sectionKey}`

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{section?.label}</h1>
        <p className="mt-2 text-sm text-stone-600">{section?.description}</p>
      </div>
      <div className="grid gap-3">
        <input className="min-h-12 rounded-md border border-stone-300 px-3 text-sm" placeholder="Cerca" />
        <select className="min-h-12 rounded-md border border-stone-300 px-3 text-sm" aria-label="Filtro stato">
          <option>Tutti gli stati</option><option>Pubblicati</option><option>Bozze</option><option>Attivi</option>
        </select>
        <Link to={addPath} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Aggiungi
        </Link>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-stone-950">{item.title}</h2>
            <p className="mt-1 text-sm text-stone-600">{item.subtitle}</p>
            <div className="mt-3 grid gap-2">
              <Link className="min-h-11 rounded-md bg-stone-950 px-3 py-3 text-center text-sm font-semibold text-white" to={`/admin/${sectionKey}/${item.id}`}>Modifica</Link>
              <Link className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700" to={item.preview}>Anteprima pubblica</Link>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700"><QrCode className="h-4 w-4" /> QR Code</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
