import { wineries } from '../data/demoData'
import type { Winery } from '../types/content'
import { readWithFallback } from './fallback'

export const wineryService = {
  list: () => readWithFallback<Winery>('wineries', wineries),
  demoList: () => wineries,
  bySlug: (slug: string | undefined) => wineries.find((winery) => winery.slug === slug),
  byId: (id: string | undefined) => wineries.find((winery) => winery.id === id),
}
