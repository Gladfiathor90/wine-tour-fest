import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

type WineryCardProps = {
  winery: Winery
}

export function WineryCard({ winery }: WineryCardProps) {
  const coverClassName = winery.slug === 'azienda-vinicola-liaci' ? 'wtf-liaci-cover' : ''
  const logoClassName = winery.slug === 'tenute-emera'
    ? 'wtf-winery-logo-emera'
    : winery.slug === 'novecentoventi'
      ? 'wtf-winery-logo-novecentoventi'
      : ''

  return (
    <Link to={publicRoutes.wineryDetail(winery.slug)} className="block overflow-hidden rounded-lg border border-stone-200 bg-cream-50 shadow-sm">
      <img src={winery.coverImageUrl} alt="" className={`h-48 w-full object-cover ${coverClassName}`} loading="lazy" />
      <div className="space-y-4 p-5 text-center">
        <img src={winery.logoUrl} alt={`Logo ${winery.name}`} className={`mx-auto h-16 max-w-36 object-contain ${logoClassName}`} loading="lazy" />
        <h2 className="text-2xl font-bold leading-tight text-stone-950">{winery.name}</h2>
        <p className="text-base leading-7 text-stone-600">{winery.shortDescription}</p>
        <span className="inline-flex items-center gap-2 text-base font-semibold text-wine-700">
          Scopri
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
