import { ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { slugifyWineryName, type WineryFormValues } from '../../services/wineryService'
import type { Winery } from '../../types/content'
import { adminRoutes, publicRoutes } from '../../utils/routes'

const emptyForm: WineryFormValues = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  logoUrl: '',
  coverImageUrl: '',
  gallery: [],
  address: '',
  city: 'Lizzano',
  province: 'TA',
  latitude: '',
  longitude: '',
  phone: '',
  email: '',
  website: '',
  facebook: '',
  instagram: '',
  openingHours: '',
  tastings: '',
  displayOrder: '0',
  published: false,
}

function wineryToForm(winery: Winery): WineryFormValues {
  return {
    name: winery.name,
    slug: winery.slug,
    shortDescription: winery.shortDescription,
    description: winery.description,
    logoUrl: winery.logoUrl,
    coverImageUrl: winery.coverImageUrl,
    gallery: winery.gallery,
    address: winery.address,
    city: winery.city,
    province: 'TA',
    latitude: winery.latitude ? String(winery.latitude) : '',
    longitude: winery.longitude ? String(winery.longitude) : '',
    phone: winery.phone ?? '',
    email: winery.email ?? '',
    website: winery.website ?? '',
    facebook: winery.facebook ?? '',
    instagram: winery.instagram ?? '',
    openingHours: winery.openingHours,
    tastings: '',
    displayOrder: '0',
    published: winery.published,
  }
}

export function AdminWineriesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nuova')
  const isForm = isNew || Boolean(id)
  const [wineries, setWineries] = useState<Winery[]>([])
  const [form, setForm] = useState<WineryFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  usePageMeta('Admin cantine', 'Gestione cantine Wine Tour Fest.')

  const currentWinery = useMemo(() => wineries.find((winery) => winery.id === id), [id, wineries])

  useEffect(() => {
    let cancelled = false

    async function loadWineries() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.wineries.getAll()
        if (!cancelled) setWineries(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare le cantine da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadWineries()

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
    if (currentWinery) setForm(wineryToForm(currentWinery))
  }, [currentWinery, isForm, isNew])

  function updateField(field: keyof WineryFormValues, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function reloadList() {
    const result = await contentService.wineries.getAll()
    setWineries(result)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const prepared = {
        ...form,
        slug: form.slug || slugifyWineryName(form.name),
      }
      const saved = isNew ? await contentService.wineries.create(prepared) : await contentService.wineries.update(id ?? '', prepared)
      await reloadList()
      setMessage('Cantina salvata.')
      if (isNew) navigate(adminRoutes.editWinery(saved.id))
    } catch {
      setError('Salvataggio non riuscito. Controlla i campi e la configurazione Supabase.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm('Eliminare questa cantina?')) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await contentService.wineries.remove(id)
      await reloadList()
      navigate(adminRoutes.wineries)
    } catch {
      setError('Eliminazione non riuscita.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadFile(event: ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverImageUrl' | 'gallery') {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(field)
    setError('')
    try {
      const folder = id ? id : slugifyWineryName(form.name) || 'nuova-cantina'
      const url = await contentService.wineries.uploadImage(file, folder)
      if (field === 'gallery') updateField('gallery', [...form.gallery, url])
      else updateField(field, url)
    } catch {
      setError('Upload immagine non riuscito.')
    } finally {
      setUploading('')
      event.target.value = ''
    }
  }

  if (!isForm) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">Cantine</h1>
          <p className="mt-2 text-sm text-stone-600">Crea, modifica, elimina e pubblica le cantine lette dalla web app pubblica.</p>
        </div>
        {error ? <EmptyState icon={Trash2} title="Cantine non disponibili" description={error} /> : null}
        <Link to={adminRoutes.newWinery} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Aggiungi cantina
        </Link>
        {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento cantine...</p> : null}
        {!loading && !error && !wineries.length ? <EmptyState icon={Plus} title="Nessuna cantina" description="Aggiungi la prima cantina dal pulsante qui sopra." /> : null}
        <div className="grid gap-3">
          {wineries.map((winery) => (
            <article key={winery.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <img src={winery.logoUrl} alt="" className="h-14 w-14 rounded-md object-contain" />
                <div>
                  <h2 className="font-semibold text-stone-950">{winery.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">{winery.shortDescription || 'Nessuna descrizione breve.'}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">{winery.published ? 'Pubblicata' : 'Bozza'}</p>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <Link className="min-h-11 rounded-md bg-stone-950 px-3 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.editWinery(winery.id)}>Modifica</Link>
                {winery.published ? <Link className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700" to={publicRoutes.wineryDetail(winery.slug)}>Anteprima pubblica</Link> : null}
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Cantine</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{isNew ? 'Nuova cantina' : 'Modifica cantina'}</h1>
        <p className="mt-2 text-sm text-stone-600">I dati salvati qui vengono letti dalla pagina pubblica Cantine.</p>
      </div>
      {message ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{message}</p> : null}
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700">Nome<input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" required /></label>
        <label className="block text-sm font-semibold text-stone-700">Slug<input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugifyWineryName(form.name) || 'slug-cantina'} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Descrizione breve<textarea value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-stone-300 px-3 py-2 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Descrizione completa<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} className="mt-1 min-h-32 w-full rounded-md border border-stone-300 px-3 py-2 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Indirizzo<input value={form.address} onChange={(event) => updateField('address', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-stone-700">Città<input value={form.city} onChange={(event) => updateField('city', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Provincia<input value={form.province} onChange={(event) => updateField('province', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-stone-700">Latitudine<input value={form.latitude} onChange={(event) => updateField('latitude', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Longitudine<input value={form.longitude} onChange={(event) => updateField('longitude', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        </div>
        <div className="grid gap-3">
          <label className="block text-sm font-semibold text-stone-700">Telefono<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Email<input value={form.email} onChange={(event) => updateField('email', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Sito<input value={form.website} onChange={(event) => updateField('website', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Facebook<input value={form.facebook} onChange={(event) => updateField('facebook', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Instagram<input value={form.instagram} onChange={(event) => updateField('instagram', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Orari<input value={form.openingHours} onChange={(event) => updateField('openingHours', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Degustazioni<textarea value={form.tastings} onChange={(event) => updateField('tastings', event.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-stone-300 px-3 py-2 text-sm" /></label>
          <label className="block text-sm font-semibold text-stone-700">Ordine<input value={form.displayOrder} onChange={(event) => updateField('displayOrder', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        </div>
        <div className="grid gap-3 rounded-md border border-stone-200 p-3">
          <UploadField label="Logo" uploading={uploading === 'logoUrl'} onChange={(event) => uploadFile(event, 'logoUrl')} />
          {form.logoUrl ? <img src={form.logoUrl} alt="" className="mx-auto h-20 w-20 rounded-md object-contain" /> : null}
          <UploadField label="Copertina" uploading={uploading === 'coverImageUrl'} onChange={(event) => uploadFile(event, 'coverImageUrl')} />
          {form.coverImageUrl ? <img src={form.coverImageUrl} alt="" className="h-36 w-full rounded-md object-cover" /> : null}
          <UploadField label="Aggiungi immagine galleria" uploading={uploading === 'gallery'} onChange={(event) => uploadFile(event, 'gallery')} />
          {form.gallery.length ? (
            <div className="grid grid-cols-2 gap-2">
              {form.gallery.map((image) => (
                <div key={image} className="space-y-2">
                  <img src={image} alt="" className="h-28 w-full rounded-md object-cover" />
                  <button type="button" onClick={() => updateField('gallery', form.gallery.filter((item) => item !== image))} className="min-h-10 w-full rounded-md bg-red-50 px-3 text-xs font-semibold text-red-700">Rimuovi</button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <label className="flex min-h-12 items-center justify-center gap-3 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700">
          <input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} />
          Pubblicata
        </label>
        <div className="grid gap-3">
          <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvataggio...' : 'Salva cantina'}
          </button>
          {!isNew ? (
            <button type="button" disabled={saving} onClick={handleDelete} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:opacity-60">
              <Trash2 className="h-4 w-4" /> Elimina cantina
            </button>
          ) : null}
          <Link to={adminRoutes.wineries} className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700">Torna alla lista</Link>
        </div>
      </form>
    </div>
  )
}

type UploadFieldProps = {
  label: string
  uploading: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function UploadField({ label, uploading, onChange }: UploadFieldProps) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-cream-100 px-3 text-sm font-semibold text-wine-700">
      <ImagePlus className="h-4 w-4" aria-hidden="true" />
      {uploading ? 'Upload...' : label}
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  )
}
