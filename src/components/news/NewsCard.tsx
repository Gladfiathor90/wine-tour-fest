import { Link } from 'react-router-dom'
import type { NewsItem } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

type NewsCardProps = {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <img src={item.imageUrl} alt="" className="h-40 w-full bg-[#f6f2e8] object-contain p-2" loading="lazy" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-wine-700">{item.publishedAt}</p>
          {item.important ? (
            <span className="rounded-md bg-wine-100 px-2 py-1 text-xs font-semibold text-wine-700">
              Importante
            </span>
          ) : null}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-stone-950">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{item.excerpt}</p>
        <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-wine-700" to={publicRoutes.newsDetail(item.slug)}>
          Leggi
        </Link>
      </div>
    </article>
  )
}
