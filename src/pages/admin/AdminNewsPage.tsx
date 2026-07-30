import { ImagePlus, Newspaper, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { slugifyNewsTitle, type NewsFormValues } from '../../services/newsService'
import type { NewsItem } from '../../types/content'
import { adminRoutes, publicRoutes } from '../../utils/routes'

const emptyForm: NewsFormValues = {
  title: '',
  slug: '',
  content: '',
  imageUrl: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  published: false,
}

function newsToForm(item: NewsItem): NewsFormValues {
  return {
    title: item.title,
    slug: item.slug,
    content: item.content,
    imageUrl: item.imageUrl,
    publishedDate: item.publishedAt,
    published: item.published,
  }
}

export function AdminNewsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nuova')
  const isForm = isNew || Boolean(id)
  const [news, setNews] = useState<NewsItem[]>([])
  const [form, setForm] = useState<NewsFormValues>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  usePageMeta('Admin news', 'Gestione news Wine Tour Fest.')

  const currentNews = useMemo(() => news.find((item) => item.id === id), [id, news])

  useEffect(() => {
    let cancelled = false

    async function loadNews() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.news.getAll()
        if (!cancelled) setNews(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare le news da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadNews()

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
    if (currentNews) setForm(newsToForm(currentNews))
  }, [currentNews, isForm, isNew])

  function updateField(field: keyof NewsFormValues, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function reloadList() {
    setNews(await contentService.news.getAll())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const prepared = { ...form, slug: form.slug || slugifyNewsTitle(form.title) }
      const saved = isNew ? await contentService.news.create(prepared) : await contentService.news.update(id ?? '', prepared)
      await reloadList()
      setMessage('News salvata.')
      if (isNew) navigate(adminRoutes.editNews(saved.id))
    } catch {
      setError('Salvataggio non riuscito. Controlla titolo, slug e configurazione Supabase.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm('Eliminare questa news?')) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await contentService.news.remove(id)
      await reloadList()
      navigate(adminRoutes.news)
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
      const folder = id ? id : slugifyNewsTitle(form.title) || 'nuova-news'
      const url = await contentService.news.uploadImage(file, folder)
      updateField('imageUrl', url)
    } catch {
      setError('Upload immagine non riuscito. Verifica le policy Storage del bucket news.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function removeImage() {
    if (!form.imageUrl) return
    setUploading(true)
    setError('')
    try {
      await contentService.news.removeImage(form.imageUrl)
      updateField('imageUrl', '')
    } catch {
      setError('Rimozione immagine non riuscita.')
    } finally {
      setUploading(false)
    }
  }

  if (!isForm) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">News</h1>
          <p className="mt-2 text-sm text-stone-600">Crea, modifica, elimina e pubblica comunicazioni.</p>
        </div>
        {error ? <EmptyState icon={Newspaper} title="News non disponibili" description={error} /> : null}
        <Link to={adminRoutes.newNews} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Aggiungi news
        </Link>
        {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento news...</p> : null}
        {!loading && !error && !news.length ? <EmptyState icon={Plus} title="Nessuna news" description="Aggiungi la prima comunicazione." /> : null}
        <div className="grid gap-3">
          {news.map((item) => (
            <article key={item.id} className="rounded-lg bg-white p-4 shadow-sm">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-3 h-32 w-full rounded-md object-cover" /> : null}
              <h2 className="font-semibold text-stone-950">{item.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{item.publishedAt}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-wine-700">{item.published ? 'Pubblicata' : 'Bozza'}</p>
              <div className="mt-3 grid gap-2">
                <Link className="min-h-11 rounded-md bg-stone-950 px-3 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.editNews(item.id)}>Modifica</Link>
                {item.published ? <Link className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700" to={publicRoutes.newsDetail(item.slug)}>Anteprima pubblica</Link> : null}
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">News</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{isNew ? 'Nuova news' : 'Modifica news'}</h1>
        <p className="mt-2 text-sm text-stone-600">I contenuti pubblicati compaiono nella pagina News.</p>
      </div>
      {message ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{message}</p> : null}
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700">Titolo<input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" required /></label>
        <label className="block text-sm font-semibold text-stone-700">Slug<input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugifyNewsTitle(form.title) || 'slug-news'} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Data pubblicazione<input type="date" value={form.publishedDate} onChange={(event) => updateField('publishedDate', event.target.value)} className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" /></label>
        <label className="block text-sm font-semibold text-stone-700">Testo<textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} className="mt-1 min-h-40 w-full rounded-md border border-stone-300 px-3 py-2 text-sm" /></label>
        <div className="grid gap-3 rounded-md border border-stone-200 p-3">
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-cream-100 px-3 text-sm font-semibold text-wine-700">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {uploading ? 'Upload...' : form.imageUrl ? 'Sostituisci immagine' : 'Carica immagine'}
            <input type="file" accept="image/*" onChange={uploadImage} className="sr-only" />
          </label>
          {form.imageUrl ? (
            <div className="space-y-2">
              <img src={form.imageUrl} alt="" className="h-40 w-full rounded-md object-cover" />
              <button type="button" onClick={removeImage} className="min-h-10 w-full rounded-md bg-red-50 px-3 text-xs font-semibold text-red-700">Rimuovi immagine</button>
            </div>
          ) : null}
        </div>
        <label className="flex min-h-12 items-center justify-center gap-3 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700">
          <input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} />
          Pubblicata
        </label>
        <div className="grid gap-3">
          <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvataggio...' : 'Salva news'}
          </button>
          {!isNew ? (
            <button type="button" disabled={saving} onClick={handleDelete} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:opacity-60">
              <Trash2 className="h-4 w-4" /> Elimina news
            </button>
          ) : null}
          <Link to={adminRoutes.news} className="min-h-11 rounded-md bg-cream-100 px-3 py-3 text-center text-sm font-semibold text-wine-700">Torna alla lista</Link>
        </div>
      </form>
    </div>
  )
}
