import { ExternalLink, Globe, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { QrCodeBox } from '../../components/common/QrCodeBox'
import { EventCard } from '../../components/events/EventCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { sharePage } from '../../utils/share'
import { publicRoutes } from '../../utils/routes'

export function WineryDetailPage() {
  const { slug } = useParams()
  const winery = contentService.wineries.bySlug(slug)
  const [expanded, setExpanded] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  usePageMeta(winery?.name ?? 'Cantina', winery?.shortDescription ?? 'Scheda cantina Wine Tour Fest.')

  if (!winery) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Cantina" />
        <EmptyState icon={MapPin} title="Cantina non trovata" description="Questo QR o indirizzo non corrisponde a una cantina pubblicata." />
      </div>
    )
  }

  const linkedEvents = contentService.events.byWineryId(winery.id)
  const quickActions = [
    winery.phone ? { label: 'Chiama', href: `tel:${winery.phone}`, icon: Phone } : null,
    { label: 'Indicazioni', href: winery.googleMapsUrl, icon: MapPin },
    winery.website ? { label: 'Sito', href: winery.website, icon: Globe } : null,
    winery.instagram ? { label: 'Instagram', href: winery.instagram, icon: Globe } : null,
  ].filter(Boolean)

  const currentWinery = winery

  async function handleShare() {
    setShareMessage(await sharePage(currentWinery.name, currentWinery.shortDescription))
  }

  return (
    <div className="space-y-6">
      <PublicHeader back title={winery.name} onShare={handleShare} />
      {shareMessage ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{shareMessage}</p> : null}
      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <img src={winery.coverImageUrl} alt="" className="h-64 w-full object-cover" />
        <div className="p-5">
          <img src={winery.logoUrl} alt={`Logo ${winery.name}`} className="-mt-14 h-20 w-20 rounded-full border-4 border-white bg-cream-50 object-contain" />
          <h1 className="mt-3 text-3xl font-bold text-stone-950">{winery.name}</h1>
          <p className="mt-1 flex items-center gap-2 text-stone-600"><MapPin className="h-4 w-4" aria-hidden="true" />{winery.address}, {winery.city}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => action ? (
          <a key={action.label} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-stone-800 shadow-sm">
            <action.icon className="h-4 w-4 text-wine-700" aria-hidden="true" />
            {action.label}
          </a>
        ) : null)}
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Descrizione</h2>
        <p className="mt-3 text-base leading-7 text-stone-600">{expanded ? winery.description : winery.shortDescription}</p>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-3 min-h-11 text-sm font-semibold text-wine-700">
          {expanded ? 'Riduci' : 'Leggi tutto'}
        </button>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Informazioni</h2>
        <div className="mt-4 space-y-3 text-sm text-stone-600">
          <p><strong>Indirizzo:</strong> {winery.address}, {winery.city}</p>
          {winery.phone ? <p><strong>Telefono:</strong> {winery.phone}</p> : null}
          {winery.email ? <p><strong>Email:</strong> {winery.email}</p> : null}
          {winery.website ? <p><strong>Sito:</strong> {winery.website}</p> : null}
          {winery.instagram ? <p><strong>Instagram:</strong> disponibile</p> : null}
          {winery.facebook ? <p><strong>Facebook:</strong> disponibile</p> : null}
          <p><strong>Orari:</strong> {winery.openingHours}</p>
        </div>
        <a href={winery.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Apri su Google Maps
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-950">Galleria</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 min-[700px]:-mx-6 min-[700px]:px-6">
          {winery.gallery.map((image) => <img key={image} src={image} alt="" className="h-40 min-w-[78%] rounded-lg object-cover" loading="lazy" />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-950">Eventi collegati</h2>
        {linkedEvents.length ? linkedEvents.map((event) => <EventCard key={event.id} event={event} />) : <p className="text-sm text-stone-600">Nessun evento collegato nei dati demo.</p>}
      </section>

      <QrCodeBox url={publicRoutes.wineryDetail(winery.slug)} title="QR Code cantina" />

      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-wine-700" to={publicRoutes.wineries}>
        Torna alle cantine
      </Link>
    </div>
  )
}
