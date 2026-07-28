import { Utensils } from 'lucide-react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

export function GastronomyPage() {
  const days = contentService.gastronomy.demoList()
  usePageMeta('Gastronomia', 'Menu food e ristorazione Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Gastronomia" />
      <section className="rounded-lg bg-cream-100 p-5 shadow-sm">
        <Utensils className="h-7 w-7 text-gold-700" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-700">Menu</p>
        <h1 className="mt-1 text-4xl font-black uppercase leading-none text-wine-900">Food</h1>
        <p className="mt-3 text-lg font-semibold text-olive-700">Ristorazione Wine Tour Fest 2026</p>
      </section>

      <section className="overflow-hidden rounded-lg border border-wine-700/20 bg-cream-50 shadow-sm">
        {days.map((day, index) => (
          <article key={day.id} className={`grid grid-cols-[116px_1fr] gap-4 p-4 ${index ? 'border-t border-dashed border-stone-500/70' : ''}`}>
            <div className="border-r border-dashed border-stone-500/70 pr-3">
              <p className="text-6xl font-black leading-none text-wine-700">{day.day}</p>
              <p className="mt-1 text-lg font-semibold uppercase leading-none text-wine-700">{day.month}</p>
              <p className="text-3xl font-light leading-none text-wine-700/70">{day.year}</p>
            </div>
            <div className="space-y-3">
              {day.dishes.map((dish) => (
                <p key={dish} className="text-lg font-extrabold leading-snug text-wine-700">{dish}</p>
              ))}
              {day.note ? <p className="pt-2 text-sm font-bold italic text-stone-800">+ {day.note}</p> : null}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg bg-wine-900 p-5 text-cream-50 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-cream-100">Prezzo demo</p>
        <p className="mt-2 text-6xl font-black">€7</p>
        <p className="mt-2 text-sm text-cream-100">Menu gastronomia con acqua inclusa. Dati aggiornabili in futuro dall’area admin.</p>
      </section>
    </div>
  )
}
