import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FestivalEvent } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

type EventCardProps = {
  event: FestivalEvent
}

const statusLabel = {
  scheduled: 'Programmato',
  live: 'In corso',
  finished: 'Concluso',
  cancelled: 'Annullato',
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className={`rounded-lg border bg-white p-4 shadow-sm ${event.status === 'live' ? 'border-olive-700 ring-2 ring-olive-700/15' : event.status === 'cancelled' ? 'border-red-200 opacity-75' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
            {event.category}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-stone-950">{event.title}</h2>
        </div>
        <span className="rounded-md bg-gold-100 px-2 py-1 text-sm font-semibold text-gold-900">
          {event.startTime}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-stone-600">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {event.startDate} · {event.startTime}-{event.endTime}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {event.location}
        </p>
      </div>
      <p className="mt-3 inline-flex rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">
        {statusLabel[event.status]}
      </p>
      <p className="mt-4 text-sm leading-6 text-stone-600">{event.shortDescription}</p>
      <Link
        to={publicRoutes.eventDetail(event.slug)}
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-wine-700"
      >
        Dettaglio evento
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  )
}
