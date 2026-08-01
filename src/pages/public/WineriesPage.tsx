import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { WineryCard } from '../../components/wineries/WineryCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { Winery } from '../../types/content'

export function WineriesPage() {
  const [query, setQuery] = useState('')
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

  const filtered = useMemo(() => {
    return wineries.filter((winery) => {
      const matchesQuery = `${winery.name} ${winery.city} ${winery.shortDescription}`.toLowerCase().includes(query.toLowerCase())
      return matchesQuery
    })
  }, [query, wineries])

  return (
    <div className="space-y-5">
      <PublicHeader title="Cantine" />
      <SectionHeader eyebrow="Cantine" title="Cantine partecipanti" description="Cerca una cantina e apri la scheda dedicata." />
      <label className="flex min-h-12 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 shadow-sm">
        <Search className="h-5 w-5 text-stone-500" aria-hidden="true" />
        <span className="sr-only">Cerca cantina</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca cantina o localita" className="min-h-11 flex-1 bg-transparent text-sm outline-none" />
      </label>
      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento cantine...</p> : null}
      {error ? <EmptyState icon={Search} title="Cantine non disponibili" description={error} /> : null}
      {!loading && !error && !filtered.length ? <EmptyState icon={Search} title="Nessuna cantina trovata" description="Non ci sono cantine pubblicate che corrispondono alla ricerca." /> : null}
      {!loading && !error && filtered.length ? (
        <div className="grid gap-4">
          {filtered.map((winery) => <WineryCard key={winery.id} winery={winery} />)}
        </div>
      ) : null}
    </div>
  )
}
