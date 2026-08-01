import { Globe, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'
import { sharePage } from '../../utils/share'

export function OliveMillDetailPage() {
  const { slug } = useParams()
  const [shareMessage, setShareMessage] = useState('')
  const mill = contentService.oliveMills.getBySlug(slug)

  usePageMeta(mill?.name ?? 'Frantoio', mill?.shortDescription ?? 'Scheda frantoio Wine Tour Fest.')

  if (!mill) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Frantoio" />
        <EmptyState icon={MapPin} title="Frantoio non trovato" description="Questo frantoio non è disponibile." />
      </div>
    )
  }

  const quickActions = [
    mill.phone ? { label: 'Chiama', href: `tel:${mill.phone}`, icon: Phone } : null,
    { label: 'Indicazioni', href: mill.googleMapsUrl, icon: MapPin },
    mill.website ? { label: 'Sito', href: mill.website, icon: Globe } : null,
    mill.instagram ? { label: 'Instagram', href: mill.instagram, icon: Globe } : null,
  ].filter(Boolean)
  const currentMill = mill

  async function handleShare() {
    setShareMessage(await sharePage(currentMill.name, currentMill.shortDescription))
  }

  return (
    <div className="space-y-6">
      <PublicHeader back title={mill.name} onShare={handleShare} />
      {shareMessage ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{shareMessage}</p> : null}
      <section className="overflow-hidden rounded-lg border border-stone-200 bg-cream-50 shadow-sm">
        <img src={mill.coverImageUrl} alt="" className="h-72 w-full object-cover" />
        <div className="space-y-5 p-6 text-center">
          <img src={mill.logoUrl} alt={`Logo ${mill.name}`} className="mx-auto h-20 max-w-44 object-contain" />
          <h1 className="text-3xl font-bold leading-tight text-stone-950">{mill.name}</h1>
          <p className="text-base leading-8 text-stone-600">{mill.description}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => action ? (
          <a key={action.label} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-cream-50 px-3 text-sm font-semibold text-stone-800 shadow-sm">
            <action.icon className="h-4 w-4 text-wine-700" aria-hidden="true" />
            {action.label}
          </a>
        ) : null)}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-stone-950">Galleria</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 min-[700px]:-mx-6 min-[700px]:px-6">
          {mill.gallery.map((image) => <img key={image} src={image} alt="" className="h-40 min-w-[78%] rounded-lg object-cover" loading="lazy" />)}
        </div>
      </section>

      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-wine-700" to={publicRoutes.oliveMills}>
        Torna ai frantoi
      </Link>
    </div>
  )
}
