import { CalendarDays, Clock, ExternalLink, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { FestivalEvent, Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'
import { sharePage } from '../../utils/share'

export function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState<FestivalEvent | null>(null)
  const [winery, setWinery] = useState<Winery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  usePageMeta(event?.title ?? 'Evento', event?.shortDescription ?? 'Dettaglio evento Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function loadEvent() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.events.getBySlug(slug)
        if (cancelled) return
        setEvent(result)
        if (result?.wineryId) {
          const linkedWinery = await contentService.wineries.getById(result.wineryId)
          if (!cancelled) setWinery(linkedWinery)
        } else {
          setWinery(null)
        }
      } catch {
        if (!cancelled) setError('Non riesco a caricare questo evento da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadEvent()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Evento" />
        <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento evento...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Evento" />
        <EmptyState icon={CalendarDays} title="Evento non trovato" description={error || 'Questo evento non è disponibile o non è pubblicato.'} />
      </div>
    )
  }

  const currentEvent = event

  async function handleShare() {
    setShareMessage(await sharePage(currentEvent.title, currentEvent.shortDescription))
  }

  return (
    <div className="space-y-6">
      <PublicHeader back title={currentEvent.title} onShare={handleShare} />
      {shareMessage ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{shareMessage}</p> : null}
      {currentEvent.imageUrl ? <img src={currentEvent.imageUrl} alt="" className="h-64 w-full rounded-lg object-cover" /> : null}
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-700">{currentEvent.category}</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{currentEvent.title}</h1>
        <p className="mt-3 text-base leading-7 text-stone-600">{currentEvent.description}</p>
      </section>
      <section className="grid gap-3">
        <div className="rounded-lg bg-white p-4 shadow-sm"><CalendarDays className="h-5 w-5 text-wine-700" /><p className="mt-2 font-semibold">{currentEvent.startDate}</p></div>
        <div className="rounded-lg bg-white p-4 shadow-sm"><Clock className="h-5 w-5 text-wine-700" /><p className="mt-2 font-semibold">{currentEvent.startTime}{currentEvent.endTime ? ` - ${currentEvent.endTime}` : ''}</p></div>
        <div className="rounded-lg bg-white p-4 shadow-sm"><MapPin className="h-5 w-5 text-wine-700" /><p className="mt-2 font-semibold">{currentEvent.location}</p></div>
      </section>
      {winery ? (
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-stone-950">Cantina collegata</h2>
          <p className="mt-2 text-sm text-stone-600">{winery.name}</p>
          <div className="mt-5 grid gap-3">
            <a href={winery.googleMapsUrl} target="_blank" rel="noreferrer" className="wtf-button-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
              <ExternalLink className="h-4 w-4" /> Indicazioni
            </a>
            <Link to={publicRoutes.wineryDetail(winery.slug)} className="wtf-button-primary inline-flex min-h-12 items-center justify-center rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">Scopri la cantina</Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
