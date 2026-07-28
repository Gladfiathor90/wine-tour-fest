import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'

const dayFormatter = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

export function EventsPage() {
  const events = contentService.events.demoList()
  const days = Array.from(new Set(events.map((event) => event.startDate)))
  const categories = ['Tutti', ...Array.from(new Set(events.map((event) => event.category)))]
  const [category, setCategory] = useState('Tutti')
  usePageMeta('Programma musicale', 'Programma musicale Wine Tour Fest a Lizzano.')

  const groupedEvents = useMemo(() => {
    return days.map((day) => ({
      day,
      events: events.filter((event) => event.startDate === day && (category === 'Tutti' || event.category === category)),
    })).filter((group) => group.events.length)
  }, [category, days, events])

  return (
    <div className="space-y-5">
      <PublicHeader title="Programma" />
      <section className="rounded-lg bg-cream-100 p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-700">Vino Musica e Arte</p>
        <h1 className="mt-2 text-4xl font-black uppercase leading-none text-wine-900">Programma musicale</h1>
        <p className="mt-3 text-sm font-semibold text-olive-700">Lizzano (TA) · Centro Storico · 11, 12, 13 agosto 2026</p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-black uppercase tracking-[0.05em] ${category === item ? 'bg-wine-700 text-cream-50' : 'bg-cream-100 text-wine-700'}`}>
            {item}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border border-wine-700/20 bg-cream-50 shadow-sm">
        {groupedEvents.map((group, index) => {
          const date = new Date(group.day)
          const dayNumber = date.toLocaleDateString('it-IT', { day: '2-digit' })
          const monthYear = dayFormatter.format(date).replace(dayNumber, '').trim()

          return (
            <div key={group.day} className={`grid grid-cols-[116px_1fr] gap-4 p-4 ${index ? 'border-t border-dashed border-stone-500/70' : ''}`}>
              <div className="border-r border-dashed border-stone-500/70 pr-3">
                <p className="text-6xl font-black leading-none text-wine-700">{dayNumber}</p>
                <p className="mt-1 text-lg font-semibold uppercase leading-none text-wine-700">{monthYear.split(' ')[0]}</p>
                <p className="text-3xl font-light leading-none text-wine-700/70">{monthYear.split(' ')[1]}</p>
              </div>
              <div className="space-y-3">
                {group.events.map((event) => {
                  const isCentral = event.location.toLowerCase().includes('palco')
                  return (
                    <Link
                      key={event.id}
                      to={publicRoutes.eventDetail(event.slug)}
                    className={`block ${isCentral ? 'rounded-sm bg-wine-900 p-3 text-cream-50' : 'text-stone-800'}`}
                    >
                      <p className={`text-lg font-light italic leading-none ${isCentral ? 'text-cream-50' : 'text-stone-700'}`}>
                        {event.location} <span className="text-sm not-italic">({event.startTime} - {event.endTime})</span>
                      </p>
                      <h2 className={`mt-1 text-xl font-black leading-tight ${isCentral ? 'text-cream-50' : 'text-wine-700'}`}>
                        {event.title}
                      </h2>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
