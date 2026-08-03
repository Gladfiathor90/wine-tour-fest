import { Globe, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { Winery } from '../../types/content'
import { sharePage } from '../../utils/share'
import { publicRoutes } from '../../utils/routes'

export function WineryDetailPage() {
  const { slug } = useParams()
  const [winery, setWinery] = useState<Winery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  usePageMeta(winery?.name ?? 'Cantina', winery?.shortDescription ?? 'Scheda cantina Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function loadWinery() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.wineries.getBySlug(slug)
        if (!cancelled) setWinery(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare questa cantina da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadWinery()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Cantina" />
        <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento cantina...</p>
      </div>
    )
  }

  if (error || !winery) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Cantina" />
        <EmptyState icon={MapPin} title="Cantina non trovata" description={error || 'Questa cantina non è disponibile o non è pubblicata.'} />
      </div>
    )
  }

  const quickActions = [
    winery.phone ? { label: 'Chiama', href: `tel:${winery.phone}`, icon: Phone } : null,
    { label: 'Indicazioni', href: winery.googleMapsUrl, icon: MapPin },
    winery.website ? { label: 'Sito', href: winery.website, icon: Globe } : null,
    winery.instagram ? { label: 'Instagram', href: winery.instagram, icon: Globe } : null,
  ].filter(Boolean)

  const currentWinery = winery
  const coverClassName = winery.slug === 'azienda-vinicola-liaci'
    ? 'wtf-liaci-cover'
    : winery.slug === 'fabiana-wines'
      ? 'wtf-fabiana-cover'
      : ''
  const logoClassName = winery.slug === 'tenute-emera'
    ? 'wtf-winery-logo-emera'
    : winery.slug === 'novecentoventi'
      ? 'wtf-winery-logo-novecentoventi'
      : ''

  async function handleShare() {
    setShareMessage(await sharePage(currentWinery.name, currentWinery.shortDescription))
  }

  return (
    <div className="space-y-6">
      <PublicHeader back title={winery.name} onShare={handleShare} />
      {shareMessage ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{shareMessage}</p> : null}
      <section className="overflow-hidden rounded-lg border border-stone-200 bg-cream-50 shadow-sm">
        <img src={winery.coverImageUrl} alt="" className={`h-72 w-full object-cover ${coverClassName}`} />
        <div className="space-y-5 p-6 text-center">
          <img src={winery.logoUrl} alt={`Logo ${winery.name}`} className={`mx-auto h-20 max-w-44 object-contain ${logoClassName}`} />
          <h1 className="text-3xl font-bold leading-tight text-stone-950">{winery.name}</h1>
          <p className="text-base leading-8 text-stone-600">{winery.description}</p>
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
          {winery.gallery.map((image) => <img key={image} src={image} alt="" className="h-40 min-w-[78%] rounded-lg object-cover" loading="lazy" />)}
        </div>
      </section>

      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-wine-700" to={publicRoutes.wineries}>
        Torna alle cantine
      </Link>
    </div>
  )
}
