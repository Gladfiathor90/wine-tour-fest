import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { OliveMill } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

type OliveMillCardProps = {
  mill: OliveMill
}

export function OliveMillCard({ mill }: OliveMillCardProps) {
  return (
    <Link to={publicRoutes.oliveMillDetail(mill.slug)} className="block overflow-hidden rounded-lg border border-stone-200 bg-cream-50 shadow-sm">
      <img src={mill.coverImageUrl} alt="" className="h-48 w-full object-cover" loading="lazy" />
      <div className="space-y-4 p-5 text-center">
        <img src={mill.logoUrl} alt={`Logo ${mill.name}`} className="mx-auto h-16 max-w-36 object-contain" loading="lazy" />
        <h2 className="text-2xl font-bold leading-tight text-stone-950">{mill.name}</h2>
        <p className="text-base leading-7 text-stone-600">{mill.shortDescription}</p>
        <span className="inline-flex items-center gap-2 text-base font-semibold text-wine-700">
          Scopri
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
