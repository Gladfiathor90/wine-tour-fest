import { PublicHeader } from '../../components/common/PublicHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { SectionHeader } from '../../components/common/SectionHeader'
import { NewsCard } from '../../components/news/NewsCard'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { NewsItem } from '../../types/content'

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageMeta('News', 'Comunicazioni e aggiornamenti del Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function loadNews() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.news.getPublished()
        if (!cancelled) setNews(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare le news da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadNews()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-5">
      <PublicHeader back title="News" />
      <SectionHeader eyebrow="News" title="Aggiornamenti" description="Comunicazioni urgenti, variazioni del programma e avvisi per i visitatori." />
      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento news...</p> : null}
      {error ? <EmptyState icon={Newspaper} title="News non disponibili" description={error} /> : null}
      {!loading && !error && !news.length ? <EmptyState icon={Newspaper} title="Nessuna news pubblicata" description="Le comunicazioni saranno visibili appena pubblicate dall'organizzazione." /> : null}
      <div className="grid gap-4">
        {news.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
