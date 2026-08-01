import { ImagePlus, Plus, Save, Trophy, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { SponsorFormValues } from '../../services/sponsorService'
import type { Sponsor, SponsorLevel } from '../../types/content'
import { adminRoutes, publicRoutes } from '../../utils/routes'

const levels: SponsorLevel[] = ['Main sponsor', 'Partner', 'Sponsor', 'Patrocini', 'Associazioni']

function partnerLevelLabel(level: SponsorLevel) {
  if (level === 'Main sponsor') return 'Main partner'
  if (level === 'Sponsor') return 'Partner'
  return level
}

const emptyForm: SponsorFormValues = {
  name: '',
  logoUrl: '',
  website: '',
  level: 'Sponsor',
  displayOrder: '0',
  published: false,
}

function sponsorToForm(sponsor: Sponsor): SponsorFormValues {
  return {
    name: sponsor.name,
    logoUrl: sponsor.logoUrl,
    website: sponsor.website ?? '',
    level: sponsor.level,
    displayOrder: String(sponsor.displayOrder),
    published: sponsor.active,
  }
}

function safeFolderName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'nuovo-sponsor'
}

export function AdminSponsorsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nuovo')
  const isForm = isNew || Boolean(id)
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [form, setForm] = useState<SponsorFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  usePageMeta('Admin partners', 'Gestione partners Wine Tour Fest.')

  const currentSponsor = useMemo(() => sponsors.find((sponsor) => sponsor.id === id), [id, sponsors])

  useEffect(() => {
    let cancelled = false

    async function loadSponsors() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.sponsors.getAll()
        if (!cancelled) setSponsors(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare i partners da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadSponsors()

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
    if (currentSponsor) setForm(sponsorToForm(currentSponsor))
  }, [currentSponsor, isForm, isNew])

  function updateField(field: keyof SponsorFormValues, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function reloadList() {
    setSponsors(await contentService.sponsors.getAll())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const saved = isNew ? await contentService.sponsors.create(form) : await contentService.sponsors.update(id ?? '', form)
      await reloadList()
      setMessage('Partner salvato.')
      if (isNew) navigate(adminRoutes.editSponsor(saved.id))
    } catch {
      setError('Salvataggio non riuscito. Controlla nome, logo e configurazione Supabase.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm('Eliminare questo partner?')) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await contentService.sponsors.remove(id)
      await reloadList()
      navigate(adminRoutes.sponsors)
    } catch {
      setError('Eliminazione non riuscita.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const folder = id ? id : safeFolderName(form.name)
      const url = await contentService.sponsors.uploadLogo(file, folder)
      updateField('logoUrl', url)
    } catch {
      setError('Upload logo non riuscito. Verifica le policy Storage del bucket partners.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function removeLogo() {
    if (!form.logoUrl) return
    setUploading(true)
    setError('')
    try {
      await contentService.sponsors.removeLogo(form.logoUrl)
      updateField('logoUrl', '')
    } catch {
      setError('Rimozione logo non riuscita.')
    } finally {
      setUploading(false)
    }
  }

  if (!isForm) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">Partners</h1>
          <p className="mt-2 text-sm text-stone-600">Gestisci loghi, link, ordine e pubblicazione.</p>
        </div>
        {error ? <EmptyState icon={Trophy} title="Partners non disponibili" description={error} /> : null}
        <Link to={adminRoutes.newSponsor} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Aggiungi partner
        </Link>
        {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento partners...</p> : null}
        {!loading && !error && !sponsors.length ? <EmptyState icon={Plus} title="Nessun partner" description="Aggiungi il primo logo partner." /> : null}
        <div className="grid gap-3">
          {sponsors.map((sponsor) => (
            <article key={sponsor.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt="" className="h-14 w-14 rounded-md object-contain" /> : <div className="h-14 w-14 rounded-md bg-stone-100" />}
                <div>
                  <h2 className="font-semibold text-stone-950">{sponsor.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">{partnerLevelLabel(sponsor.level)}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">{sponsor.active ? 'Pubblicato' : 'Bozza'}</p>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <Link className="min-h-11 rounded-md bg-stone-950 px-3 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.editSponsor(sponsor.id)}>Modifica</Link>
                {sponsor.active ? <Link className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700" to={publicRoutes.partners}>Anteprima pubblica</Link> : null}
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Partners</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{isNew ? 'Nuovo partner' : 'Modifica partner'}</h1>
        <p className="mt-2 text-sm text-stone-600">I loghi pubblicati compaiono nella pagina Partners.</p>
      </div>
      {message ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{message}</p> : null}
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700">Nome<input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" required /></label>
        <label className="block text-sm font-semibold text-stone-700">Link<input value={form.website} onChange={(event) => updateField('website', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Livello<select value={form.level} onChange={(event) => updateField('level', event.target.value as SponsorLevel)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm">{levels.map((level) => <option key={level} value={level}>{partnerLevelLabel(level)}</option>)}</select></label>
        <label className="block text-sm font-semibold text-stone-700">Ordine<input value={form.displayOrder} onChange={(event) => updateField('displayOrder', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <div className="grid gap-3 rounded-md border border-stone-200 p-3">
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-cream-100 px-3 text-sm font-semibold text-wine-700">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {uploading ? 'Upload...' : form.logoUrl ? 'Sostituisci logo' : 'Carica logo'}
            <input type="file" accept="image/*" onChange={uploadLogo} className="sr-only" />
          </label>
          {form.logoUrl ? (
            <div className="space-y-2">
              <img src={form.logoUrl} alt="" className="mx-auto h-28 w-28 rounded-md object-contain" />
              <button type="button" onClick={removeLogo} className="min-h-10 w-full rounded-md bg-red-50 px-3 text-xs font-semibold text-red-700">Rimuovi logo</button>
            </div>
          ) : null}
        </div>
        <label className="flex min-h-12 items-center justify-center gap-3 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700">
          <input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} />
          Pubblicato
        </label>
        <div className="grid gap-3">
          <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvataggio...' : 'Salva partner'}
          </button>
          {!isNew ? (
            <button type="button" disabled={saving} onClick={handleDelete} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:opacity-60">
              <Trash2 className="h-4 w-4" /> Elimina partner
            </button>
          ) : null}
          <Link to={adminRoutes.sponsors} className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700">Torna alla lista</Link>
        </div>
      </form>
    </div>
  )
}
