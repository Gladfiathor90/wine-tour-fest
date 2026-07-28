import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { WineryCard } from '../../components/wineries/WineryCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

const filters = ['Tutte', 'Aperte ora', 'Con eventi'] as const

export function WineriesPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tutte')
  const wineries = contentService.wineries.demoList()
  const events = contentService.events.demoList()
  usePageMeta('Cantine', 'Elenco cantine partecipanti al Wine Tour Fest.')

  const filtered = useMemo(() => {
    return wineries.filter((winery) => {
      const matchesQuery = `${winery.name} ${winery.city} ${winery.shortDescription}`.toLowerCase().includes(query.toLowerCase())
      const hasEvents = events.some((event) => event.wineryId === winery.id)
      if (filter === 'Con eventi') return matchesQuery && hasEvents
      if (filter === 'Aperte ora') return matchesQuery && Boolean(winery.openingHours)
      return matchesQuery
    })
  }, [events, filter, query, wineries])

  return (
    <div className="space-y-5">
      <PublicHeader title="Cantine" />
      <SectionHeader eyebrow="Cantine" title="Cantine partecipanti" description="Cerca una cantina, controlla gli orari e apri la scheda QR-ready." />
      <label className="flex min-h-12 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 shadow-sm">
        <Search className="h-5 w-5 text-stone-500" aria-hidden="true" />
        <span className="sr-only">Cerca cantina</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca cantina o localita" className="min-h-11 flex-1 bg-transparent text-sm outline-none" />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-semibold ${filter === item ? 'bg-wine-700 text-white' : 'bg-white text-stone-700'}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {filtered.map((winery) => <WineryCard key={winery.id} winery={winery} />)}
      </div>
    </div>
  )
}
