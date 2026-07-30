import { CalendarDays, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { slugifyEventTitle, type EventFormValues } from '../../services/eventService'
import type { FestivalEvent, Winery } from '../../types/content'
import { adminRoutes, publicRoutes } from '../../utils/routes'

const emptyForm: EventFormValues = {
  title: '',
  slug: '',
  description: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  location: '',
  category: 'Musica',
  imageUrl: '',
  wineryId: '',
  displayOrder: '0',
  published: false,
}

function eventToForm(event: FestivalEvent): EventFormValues {
  return {
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventDate: event.startDate,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    imageUrl: event.imageUrl ?? '',
    wineryId: event.wineryId ?? '',
    displayOrder: '0',
    published: event.published,
  }
}

export function AdminEventsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nuovo')
  const isForm = isNew || Boolean(id)
  const [events, setEvents] = useState<FestivalEvent[]>([])
  const [wineries, setWineries] = useState<Winery[]>([])
  const [form, setForm] = useState<EventFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  usePageMeta('Admin programma', 'Gestione programma Wine Tour Fest.')

  const currentEvent = useMemo(() => events.find((event) => event.id === id), [events, id])

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [eventList, wineryList] = await Promise.all([
          contentService.events.getAll(),
          contentService.wineries.getAll(),
        ])
        if (!cancelled) {
          setEvents(eventList)
          setWineries(wineryList)
        }
      } catch {
        if (!cancelled) setError('Non riesco a caricare il programma da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isForm) return
    if (isNew) {
      setForm(emptyForm)
      return
    }
    if (currentEvent) setForm(eventToForm(currentEvent))
  }, [currentEvent, isForm, isNew])

  function updateField(field: keyof EventFormValues, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function reloadEvents() {
    const result = await contentService.events.getAll()
    setEvents(result)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const prepared = {
        ...form,
        slug: form.slug || slugifyEventTitle(form.title),
      }
      const saved = isNew ? await contentService.events.create(prepared) : await contentService.events.update(id ?? '', prepared)
      await reloadEvents()
      setMessage('Evento salvato.')
      if (isNew) navigate(adminRoutes.editEvent(saved.id))
    } catch {
      setError('Salvataggio non riuscito. Controlla i campi e le policy Supabase.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm('Eliminare questo evento?')) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await contentService.events.remove(id)
      await reloadEvents()
      navigate(adminRoutes.events)
    } catch {
      setError('Eliminazione non riuscita.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const folder = id ? id : slugifyEventTitle(form.title) || 'nuovo-evento'
      const url = await contentService.events.uploadImage(file, folder)
      updateField('imageUrl', url)
    } catch {
      setError('Upload immagine non riuscito. Verifica le policy Storage del bucket event.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  if (!isForm) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">Programma</h1>
          <p className="mt-2 text-sm text-stone-600">Crea, modifica, elimina e pubblica gli eventi del programma.</p>
        </div>
        {error ? <EmptyState icon={CalendarDays} title="Programma non disponibile" description={error} /> : null}
        <Link to={adminRoutes.newEvent} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Aggiungi evento
        </Link>
        {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento programma...</p> : null}
        {!loading && !error && !events.length ? <EmptyState icon={Plus} title="Nessun evento" description="Aggiungi il primo evento dal pulsante qui sopra." /> : null}
        <div className="grid gap-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg bg-white p-4 shadow-sm">
              {event.imageUrl ? <img src={event.imageUrl} alt="" className="mb-3 h-32 w-full rounded-md object-cover" /> : null}
              <h2 className="font-semibold text-stone-950">{event.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{event.startDate} · {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''} · {event.location}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">{event.published ? 'Pubblicato' : 'Bozza'}</p>
              <div className="mt-3 grid gap-2">
                <Link className="min-h-11 rounded-md bg-stone-950 px-3 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.editEvent(event.id)}>Modifica</Link>
                {event.published ? <Link className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700" to={publicRoutes.eventDetail(event.slug)}>Anteprima pubblica</Link> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Programma</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{isNew ? 'Nuovo evento' : 'Modifica evento'}</h1>
        <p className="mt-2 text-sm text-stone-600">I dati salvati qui vengono letti dalla pagina pubblica Programma.</p>
      </div>
      {message ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{message}</p> : null}
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700">Titolo<input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" required /></label>
        <label className="block text-sm font-semibold text-stone-700">Slug<input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugifyEventTitle(form.title) || 'slug-evento'} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Descrizione<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} className="mt-1 min-h-32 w-full rounded-md border border-stone-300 px-3 py-2 text-sm" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-stone-700">Data<input type="date" value={form.eventDate} onChange={(event) => updateField('eventDate', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Categoria<input value={form.category} onChange={(event) => updateField('category', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-stone-700">Ora inizio<input type="time" value={form.startTime} onChange={(event) => updateField('startTime', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Ora fine<input type="time" value={form.endTime} onChange={(event) => updateField('endTime', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        </div>
        <label className="block text-sm font-semibold text-stone-700">Luogo<input value={form.location} onChange={(event) => updateField('location', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Cantina collegata<select value={form.wineryId} onChange={(event) => updateField('wineryId', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm"><option value="">Nessuna cantina</option>{wineries.map((winery) => <option key={winery.id} value={winery.id}>{winery.name}</option>)}</select></label>
        <label className="block text-sm font-semibold text-stone-700">Ordine visualizzazione<input value={form.displayOrder} onChange={(event) => updateField('displayOrder', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <div className="grid gap-3 rounded-md border border-stone-200 p-3">
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-cream-100 px-3 text-sm font-semibold text-wine-700">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {uploading ? 'Upload...' : form.imageUrl ? 'Sostituisci immagine' : 'Carica immagine'}
            <input type="file" accept="image/*" onChange={uploadImage} className="sr-only" />
          </label>
          {form.imageUrl ? (
            <div className="space-y-2">
              <img src={form.imageUrl} alt="" className="h-40 w-full rounded-md object-cover" />
              <button
                type="button"
                onClick={async () => {
                  const currentUrl = form.imageUrl
                  updateField('imageUrl', '')
                  try {
                    await contentService.events.removeImage(currentUrl)
                  } catch {
                    setError('Immagine scollegata, ma rimozione dal bucket non riuscita.')
                  }
                }}
                className="min-h-10 w-full rounded-md bg-red-50 px-3 text-xs font-semibold text-red-700"
              >
                Rimuovi immagine
              </button>
            </div>
          ) : null}
        </div>
        <label className="flex min-h-12 items-center justify-center gap-3 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700">
          <input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} />
          Pubblicato
        </label>
        <div className="grid gap-3">
          <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvataggio...' : 'Salva evento'}
          </button>
          {!isNew ? (
            <button type="button" disabled={saving} onClick={handleDelete} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:opacity-60">
              <Trash2 className="h-4 w-4" /> Elimina evento
            </button>
          ) : null}
          <Link to={adminRoutes.events} className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700">Torna alla lista</Link>
        </div>
      </form>
    </div>
  )
}
