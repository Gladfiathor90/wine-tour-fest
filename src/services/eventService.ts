import { events } from '../data/demoData'
import type { FestivalEvent } from '../types/content'
import { readWithFallback } from './fallback'

const scheduleTimeValue = (time: string) => {
  const [hours = '0', minutes = '0'] = time.split(':')
  const hourValue = Number(hours)
  const minuteValue = Number(minutes)
  return (hourValue < 6 ? hourValue + 24 : hourValue) * 60 + minuteValue
}

export const eventService = {
  list: () => readWithFallback<FestivalEvent>('events', events),
  demoList: () =>
    [...events].sort((a, b) => a.startDate.localeCompare(b.startDate) || scheduleTimeValue(a.startTime) - scheduleTimeValue(b.startTime)),
  bySlug: (slug: string | undefined) => events.find((event) => event.slug === slug),
  byWineryId: (wineryId: string | undefined) => events.filter((event) => event.wineryId === wineryId),
}
