import { CheckCircle2, Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

export function WineryCheckInPage() {
  const { slug } = useParams()
  const [winery, setWinery] = useState<Winery | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'created' | 'duplicate' | ''>('')
  const [error, setError] = useState('')
  usePageMeta('Check-in cantina', 'Check-in Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function runCheckIn() {
      try {
        setLoading(true)
        setError('')
        const loadedWinery = await contentService.wineries.getBySlug(slug)
        if (!loadedWinery) {
          if (!cancelled) setError('Questa cantina non è disponibile o non è pubblicata.')
          return
        }
        const result = await contentService.checkIns.createWineryCheckIn(loadedWinery.id)
        if (!cancelled) {
          setWinery(loadedWinery)
          setStatus(result.status)
        }
      } catch {
        if (!cancelled) setError('Check-in non riuscito. Riprova tra poco o chiedi assistenza allo staff.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void runCheckIn()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Check-in" />
        <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Registrazione visita...</p>
      </div>
    )
  }

  if (error || !winery) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="Check-in" />
        <EmptyState icon={MapPin} title="Check-in non disponibile" description={error || 'Cantina non trovata.'} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PublicHeader back title="Check-in" />
      <section className="rounded-lg bg-white p-5 text-center shadow-sm">
        {status === 'created' ? <CheckCircle2 className="mx-auto h-14 w-14 text-olive-700" /> : <Clock className="mx-auto h-14 w-14 text-wine-700" />}
        <h1 className="mt-4 text-3xl font-bold leading-tight text-stone-950">{status === 'created' ? 'Visita registrata' : 'Check-in già registrato'}</h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          {status === 'created'
            ? `Grazie per la visita a ${winery.name}.`
            : `Hai già fatto check-in da ${winery.name} pochi minuti fa.`}
        </p>
      </section>
      <Link to={publicRoutes.wineryDetail(winery.slug)} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-wine-700 px-4 text-sm font-semibold text-white">
        Apri scheda cantina
      </Link>
    </div>
  )
}
