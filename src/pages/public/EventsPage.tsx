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

export function EventsPage() {
  const [events, setEvents] = useState<FestivalEvent[]>([])
  const [category, setCategory] = useState('Tutti')
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

  const categories = useMemo(() => ['Tutti', ...Array.from(new Set(events.map((event) => event.category).filter(Boolean)))], [events])

  const groupedEvents = useMemo(() => {
    const filtered = events.filter((event) => category === 'Tutti' || event.category === category)
    const days = Array.from(new Set(filtered.map((event) => event.startDate)))
    return days.map((day) => ({
      day,
      events: filtered.filter((event) => event.startDate === day),
    })).filter((group) => group.events.length)
  }, [category, events])

  return (
    <div className="space-y-5">
      <PublicHeader title="Programma" />
      <section className="rounded-lg bg-cream-100 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-700">Vino Musica e Arte</p>
        <h1 className="mt-2 text-4xl font-black uppercase leading-none text-wine-900">Programma</h1>
        <p className="mt-3 text-sm font-semibold text-olive-700">Eventi pubblicati dall'organizzazione</p>
      </section>

      {categories.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-black uppercase tracking-[0.05em] ${category === item ? 'bg-wine-700 text-cream-50' : 'bg-cream-100 text-wine-700'}`}>
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento programma...</p> : null}
      {error ? <EmptyState icon={CalendarDays} title="Programma non disponibile" description={error} /> : null}
      {!loading && !error && !groupedEvents.length ? <EmptyState icon={CalendarDays} title="Nessun evento pubblicato" description="Il programma sarà visibile appena l'organizzazione pubblicherà gli eventi." /> : null}

      {!loading && !error && groupedEvents.length ? (
        <section className="overflow-hidden rounded-lg border border-wine-700/20 bg-cream-50 shadow-sm">
          {groupedEvents.map((group, index) => {
            const date = new Date(`${group.day}T12:00:00`)
            const dayNumber = date.toLocaleDateString('it-IT', { day: '2-digit' })
            const monthYear = dayFormatter.format(date).replace(dayNumber, '').trim()

            return (
              <div key={group.day} className={`grid grid-cols-[104px_1fr] gap-3 p-4 ${index ? 'border-t border-dashed border-stone-500/70' : ''}`}>
                <div className="border-r border-dashed border-stone-500/70 pr-3">
                  <p className="text-5xl font-black leading-none text-wine-700">{dayNumber}</p>
                  <p className="mt-1 text-base font-semibold uppercase leading-none text-wine-700">{monthYear.split(' ')[0]}</p>
                  <p className="text-2xl font-light leading-none text-wine-700/70">{monthYear.split(' ')[1]}</p>
                </div>
                <div className="space-y-3">
                  {group.events.map((event) => (
                    <Link key={event.id} to={publicRoutes.eventDetail(event.slug)} className="block rounded-md bg-cream-100 p-3 text-stone-800 shadow-sm">
                      {event.imageUrl ? <img src={event.imageUrl} alt="" className="mb-3 h-28 w-full rounded-md object-cover" loading="lazy" /> : null}
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gold-700">{event.category}</p>
                      <h2 className="mt-1 text-xl font-black leading-tight text-wine-700">{event.title}</h2>
                      <p className="mt-2 text-sm font-semibold text-stone-700">
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''} · {event.location}
                      </p>
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
