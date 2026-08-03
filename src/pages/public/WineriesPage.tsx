import { Grape } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { WineryCard } from '../../components/wineries/WineryCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

function wineryLogoClassName(slug: string) {
  if (slug === 'tenute-emera') return 'wtf-winery-logo-emera'
  if (slug === 'novecentoventi') return 'wtf-winery-logo-novecentoventi'
  return ''
}

export function WineriesPage() {
  const [wineries, setWineries] = useState<Winery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageMeta('Cantine', 'Elenco cantine partecipanti al Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function loadWineries() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.wineries.getPublished()
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

  const carouselLogos = [...wineries, ...wineries]

  return (
    <div className="space-y-5">
      <PublicHeader title="Cantine" />
      <SectionHeader eyebrow="Cantine" title="Cantine partecipanti" description="Scopri le aziende del percorso Wine Tour Fest." />
      {!loading && !error && wineries.length ? (
        <section className="overflow-hidden rounded-lg border border-stone-200 bg-[#f6f2e8] py-5 shadow-sm">
          <div className="wtf-logo-carousel flex w-max items-center gap-8 px-6">
            {carouselLogos.map((winery, index) => (
              <Link
                key={`${winery.id}-${index}`}
                to={publicRoutes.wineryDetail(winery.slug)}
                className="grid h-20 w-32 shrink-0 place-items-center rounded-md bg-[#f6f2e8] px-3"
              >
                <img src={winery.logoUrl} alt={`Logo ${winery.name}`} className={`max-h-14 max-w-full object-contain ${wineryLogoClassName(winery.slug)}`} loading="eager" decoding="async" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento cantine...</p> : null}
      {error ? <EmptyState icon={Grape} title="Cantine non disponibili" description={error} /> : null}
      {!loading && !error && !wineries.length ? <EmptyState icon={Grape} title="Nessuna cantina trovata" description="Non ci sono cantine pubblicate al momento." /> : null}
      {!loading && !error && wineries.length ? (
        <div className="grid gap-4">
          {wineries.map((winery) => <WineryCard key={winery.id} winery={winery} />)}
        </div>
      ) : null}
    </div>
  )
}
