import { CalendarDays, Clock, ExternalLink, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { QrCodeBox } from '../../components/common/QrCodeBox'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'
import { sharePage } from '../../utils/share'

export function EventDetailPage() {
  const { slug } = useParams()
  const event = contentService.events.bySlug(slug)
  const winery = contentService.wineries.byId(event?.wineryId)
  const [shareMessage, setShareMessage] = useState('')
  usePageMeta(event?.title ?? 'Evento', event?.shortDescription ?? 'Dettaglio evento Wine Tour Fest.')

  if (!event) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Evento" />
        <EmptyState icon={CalendarDays} title="Evento non trovato" description="Questa pagina evento non e disponibile nei dati demo." />
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
        <div className="rounded-lg bg-white p-4 shadow-sm"><Clock className="h-5 w-5 text-wine-700" /><p className="mt-2 font-semibold">{currentEvent.startTime} - {currentEvent.endTime}</p></div>
        <div className="rounded-lg bg-white p-4 shadow-sm"><MapPin className="h-5 w-5 text-wine-700" /><p className="mt-2 font-semibold">{currentEvent.location}</p></div>
      </section>
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Informazioni aggiuntive</h2>
        <p className="mt-3 text-sm text-stone-600">Stato: {currentEvent.status}. {currentEvent.bookingRequired ? currentEvent.bookingInfo : 'Prenotazione non richiesta.'}</p>
        {winery ? <p className="mt-2 text-sm text-stone-600">Cantina associata: {winery.name}</p> : null}
        <div className="mt-5 grid gap-3">
          {winery ? (
            <a href={winery.googleMapsUrl} target="_blank" rel="noreferrer" className="wtf-button-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
              <ExternalLink className="h-4 w-4" /> Indicazioni
            </a>
          ) : null}
          {winery ? <Link to={publicRoutes.wineryDetail(winery.slug)} className="wtf-button-primary inline-flex min-h-12 items-center justify-center rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">Scopri la cantina</Link> : null}
          {currentEvent.externalUrl ? <a href={currentEvent.externalUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-wine-700">Link esterno</a> : null}
        </div>
      </section>
      <QrCodeBox url={publicRoutes.eventDetail(currentEvent.slug)} title="QR Code evento" />
    </div>
  )
}
