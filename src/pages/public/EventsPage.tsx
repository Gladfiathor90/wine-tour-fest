import { CalendarDays } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { FestivalEvent } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

const dayFormatter = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
const categoryGroups = ['Tutti', 'Musica e DJ', 'Arte e spettacoli', 'Bambini e famiglie', 'Cultura'] as const
type CategoryGroup = (typeof categoryGroups)[number]
const eventDays = [
  { label: '11', date: '2026-08-11' },
  { label: '12', date: '2026-08-12' },
  { label: '13', date: '2026-08-13' },
] as const

const locationStyles = {
  'MUSEO Mu.Pa.U': 'bg-gold-600 text-cream-50',
  'LARGO ROSARIO': 'bg-wine-900 text-cream-50',
  'LARGO MENTANA': 'bg-olive-700 text-cream-50',
  'PALCO CENTRALE': 'bg-wine-700 text-cream-50',
} satisfies Record<string, string>

function timeLabel(event: FestivalEvent) {
  if (event.endTime) return `${event.startTime}-${event.endTime}`
  return event.startTime ? `dalle ${event.startTime}` : ''
}

function locationClass(location: string) {
  return locationStyles[location as keyof typeof locationStyles] ?? 'bg-wine-900 text-cream-50'
}

function categoryGroupFor(event: FestivalEvent): Exclude<CategoryGroup, 'Tutti'> {
  const text = `${event.category} ${event.title} ${event.description}`.toLowerCase()

  if (/(bambin|cartoon|karaoke|favol|cantastorie|trampol|scientific|esperiment|arcobaleno|penguin|innova)/.test(text)) {
    return 'Bambini e famiglie'
  }

  if (/(inaugural|convegno|identit|territorio|autorita|museo|mupau|mu\\.pa\\.u)/.test(text)) {
    return 'Cultura'
  }

  if (/(danza|spettacolo|acrobatic|vertical|painting|arte|custode|vento)/.test(text)) {
    return 'Arte e spettacoli'
  }

  return 'Musica e DJ'
}

export function EventsPage() {
  const [events, setEvents] = useState<FestivalEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<(typeof eventDays)[number]['date']>('2026-08-11')
  const [category, setCategory] = useState<CategoryGroup>('Tutti')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageMeta('Programma', 'Programma eventi Wine Tour Fest a Lizzano.')

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.events.getPublished()
        if (!cancelled) setEvents(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare il programma da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadEvents()

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const available = new Set(events.filter((event) => event.startDate === selectedDay).map(categoryGroupFor))
    return categoryGroups.filter((item) => item === 'Tutti' || available.has(item))
  }, [events, selectedDay])

  const groupedEvents = useMemo(() => {
    const filtered = events.filter((event) => event.startDate === selectedDay && (category === 'Tutti' || categoryGroupFor(event) === category))
    const days = Array.from(new Set(filtered.map((event) => event.startDate)))
    return days.map((day) => ({
      day,
      events: filtered.filter((event) => event.startDate === day),
    })).filter((group) => group.events.length)
  }, [category, events, selectedDay])

  return (
    <div className="wtf-program-page space-y-4 text-center">
      <PublicHeader title="Programma" />
      <section className="overflow-hidden rounded-lg border border-wine-900/10 bg-cream-50 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wine-700">Wine Tour Fest</p>
        <h1 className="mt-2 text-3xl font-black uppercase leading-none text-wine-900">Programma eventi</h1>
        <p className="mx-auto mt-3 max-w-64 text-lg font-black uppercase leading-none text-gold-600">Agosto 2026</p>
      </section>

      <div className="grid grid-cols-3 gap-2">
        {eventDays.map((day) => (
          <button key={day.date} type="button" onClick={() => { setSelectedDay(day.date); setCategory('Tutti') }} className={`min-h-12 rounded-md border text-center font-black uppercase tracking-[0.08em] ${selectedDay === day.date ? 'border-wine-700 bg-wine-700 text-cream-50' : 'border-wine-700/20 bg-cream-50 text-wine-700'}`}>
            <span className="block text-2xl leading-none">{day.label}</span>
            <span className="text-[10px] leading-none">Agosto</span>
          </button>
        ))}
      </div>

      {categories.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-9 whitespace-nowrap rounded-md px-3 text-xs font-black uppercase tracking-[0.05em] ${category === item ? 'bg-wine-700 text-cream-50' : 'bg-cream-100 text-wine-700'}`}>
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento programma...</p> : null}
      {error ? <EmptyState icon={CalendarDays} title="Programma non disponibile" description={error} /> : null}
      {!loading && !error && !groupedEvents.length ? <EmptyState icon={CalendarDays} title="Nessun evento pubblicato" description="Il programma sarà visibile appena l'organizzazione pubblicherà gli eventi." /> : null}

      {!loading && !error && groupedEvents.length ? (
        <section className="overflow-hidden rounded-lg border border-wine-900/20 bg-cream-50 shadow-sm">
          {groupedEvents.map((group, index) => {
            const date = new Date(`${group.day}T12:00:00`)
            const dayNumber = date.toLocaleDateString('it-IT', { day: 'numeric' })
            const monthYear = dayFormatter.format(date).replace(dayNumber, '').trim()

            return (
              <div key={group.day} className={`grid grid-cols-[58px_1fr] gap-2 p-3 ${index ? 'border-t border-dashed border-wine-900/30' : ''}`}>
                <div className="border-r border-dashed border-wine-900/35 pr-3">
                  <p className="text-5xl font-black leading-[0.78] text-gold-600">{dayNumber}</p>
                  <p className="mt-2 text-xs font-semibold uppercase leading-none text-wine-700">{monthYear.split(' ')[0]}</p>
                  <p className="text-sm font-light leading-none text-wine-700/75">{monthYear.split(' ')[1]}</p>
                </div>
                <div className="space-y-2">
                  {group.events.map((event) => (
                    <Link key={event.id} to={publicRoutes.eventDetail(event.slug)} className="block overflow-hidden rounded-md bg-cream-100 text-stone-800 shadow-sm">
                      {event.imageUrl ? <img src={event.imageUrl} alt="" className="mb-2 h-20 w-full rounded-md object-cover" loading="lazy" /> : null}
                      <div className={`flex min-h-9 items-center justify-between gap-2 px-3 py-2 ${locationClass(event.location)}`}>
                        <p className="text-left text-sm font-black uppercase leading-none">{event.location}</p>
                        <p className="whitespace-nowrap text-xs font-medium leading-none opacity-95">{timeLabel(event)}</p>
                      </div>
                      <div className="p-3 pt-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gold-700">{categoryGroupFor(event)}</p>
                        <h2 className="mt-1 text-left text-lg font-black leading-tight text-wine-900">{event.title}</h2>
                        <p className="mt-1 whitespace-pre-line text-left text-xs font-medium leading-5 text-stone-700">{event.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
