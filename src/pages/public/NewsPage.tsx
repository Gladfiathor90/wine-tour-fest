import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { NewsCard } from '../../components/news/NewsCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

export function NewsPage() {
  const news = contentService.news.demoList()
  usePageMeta('News', 'Comunicazioni e aggiornamenti del Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="News" />
      <SectionHeader eyebrow="News" title="Aggiornamenti" description="Comunicazioni urgenti, variazioni del programma e avvisi per i visitatori." />
      <div className="grid gap-4">
        {news.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
