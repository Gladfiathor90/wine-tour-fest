import { sponsors } from '../data/demoData'
import type { Sponsor } from '../types/content'
import { readWithFallback } from './fallback'

export const sponsorService = {
  list: () => readWithFallback<Sponsor>('sponsors', sponsors),
  demoList: () => [...sponsors].filter((sponsor) => sponsor.active).sort((a, b) => a.displayOrder - b.displayOrder),
}
