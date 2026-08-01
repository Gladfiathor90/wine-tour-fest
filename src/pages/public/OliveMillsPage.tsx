import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { OliveMillCard } from '../../components/oliveMills/OliveMillCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

export function OliveMillsPage() {
  const [query, setQuery] = useState('')
  const oliveMills = contentService.oliveMills.demoList()

  usePageMeta('Frantoi', 'Frantoi partecipanti al Wine Tour Fest.')

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase()
    return oliveMills.filter((mill) => `${mill.name} ${mill.city} ${mill.shortDescription}`.toLowerCase().includes(normalizedQuery))
  }, [oliveMills, query])

  return (
    <div className="space-y-5">
      <PublicHeader title="Frantoi" />
      <SectionHeader eyebrow="Frantoi" title="Frantoi partecipanti" description="Scopri i produttori d'olio presenti nel percorso Wine Tour Fest." />
      <label className="flex min-h-12 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 shadow-sm">
        <Search className="h-5 w-5 text-stone-500" aria-hidden="true" />
        <span className="sr-only">Cerca frantoio</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca frantoio o localita" className="min-h-11 flex-1 bg-transparent text-sm outline-none" />
      </label>
      {!filtered.length ? <EmptyState icon={Search} title="Nessun frantoio trovato" description="Non ci sono frantoi pubblicati che corrispondono alla ricerca." /> : null}
      {filtered.length ? (
        <div className="grid gap-4">
          {filtered.map((mill) => <OliveMillCard key={mill.id} mill={mill} />)}
        </div>
      ) : null}
    </div>
  )
}
