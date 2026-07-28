import { Newspaper } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { sharePage } from '../../utils/share'

export function NewsDetailPage() {
  const { slug } = useParams()
  const item = contentService.news.bySlug(slug)
  const [shareMessage, setShareMessage] = useState('')
  usePageMeta(item?.title ?? 'News', item?.excerpt ?? 'News Wine Tour Fest.')

  if (!item) {
    return (
      <div className="space-y-4">
        <PublicHeader back title="News" />
        <EmptyState icon={Newspaper} title="News non trovata" description="Questa comunicazione non e disponibile." />
      </div>
    )
  }
  const currentItem = item

  async function handleShare() {
    setShareMessage(await sharePage(currentItem.title, currentItem.excerpt))
  }

  return (
    <article className="space-y-5">
      <PublicHeader back title="News" onShare={handleShare} />
      {shareMessage ? <p className="rounded-md bg-olive-700 px-3 py-2 text-sm font-semibold text-white">{shareMessage}</p> : null}
      <img src={currentItem.imageUrl} alt="" className="h-64 w-full rounded-lg object-cover" />
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-wine-700">{currentItem.publishedAt}</p>
          {currentItem.important ? <span className="rounded-md bg-wine-100 px-2 py-1 text-xs font-semibold text-wine-700">Importante</span> : null}
        </div>
        <h1 className="mt-3 text-3xl font-bold text-stone-950">{currentItem.title}</h1>
        <p className="mt-2 text-sm text-stone-500">Di {currentItem.author}</p>
        <p className="mt-5 text-base leading-7 text-stone-700">{currentItem.content}</p>
      </section>
    </article>
  )
}
