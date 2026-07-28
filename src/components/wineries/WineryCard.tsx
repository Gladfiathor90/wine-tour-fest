import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

type WineryCardProps = {
  winery: Winery
}

export function WineryCard({ winery }: WineryCardProps) {
  return (
    <Link to={publicRoutes.wineryDetail(winery.slug)} className="block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <img src={winery.coverImageUrl} alt="" className="h-36 w-full object-cover" loading="lazy" />
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <img src={winery.logoUrl} alt={`Logo ${winery.name}`} className="h-11 w-11 rounded-full bg-cream-50 object-contain" loading="lazy" />
          <div>
            <h2 className="text-lg font-semibold leading-tight text-stone-950">{winery.name}</h2>
            <p className="flex items-center gap-1 text-sm text-stone-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {winery.city}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-1 text-sm text-olive-700">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Aperta {winery.openingHours}
        </p>
        <p className="text-sm leading-6 text-stone-600">{winery.shortDescription}</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-wine-700">
          Scopri
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
