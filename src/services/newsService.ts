import { newsItems } from '../data/demoData'
import type { NewsItem } from '../types/content'
import { readWithFallback } from './fallback'

export const newsService = {
  list: () => readWithFallback<NewsItem>('news', newsItems),
  demoList: () => [...newsItems].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  bySlug: (slug: string | undefined) => newsItems.find((item) => item.slug === slug),
}
