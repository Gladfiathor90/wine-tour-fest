import { Droplets, Utensils } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

export function GastronomyPage() {
  const days = contentService.gastronomy.demoList()
  const [selectedDayId, setSelectedDayId] = useState(days[0]?.id ?? '')
  const selectedDay = useMemo(() => days.find((day) => day.id === selectedDayId) ?? days[0], [days, selectedDayId])

  usePageMeta('Gastronomia', 'Menu food e ristorazione Wine Tour Fest.')

  return (
    <div className="space-y-6">
      <PublicHeader back title="Gastronomia" />

      <section className="rounded-lg border border-wine-900/10 bg-[#f6f2e8] px-5 py-7 text-center shadow-sm">
        <Utensils className="mx-auto h-8 w-8 text-wine-700" aria-hidden="true" />
        <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-gold-700">Gastronomia</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-stone-950">Menù del giorno</h1>
        <p className="mx-auto mt-5 max-w-72 text-lg font-semibold leading-7 text-olive-700">
          Sapori della tradizione pugliese, serviti nel cuore del Wine Tour Fest.
        </p>
      </section>

      <div className="grid grid-cols-3 gap-2">
        {days.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => setSelectedDayId(day.id)}
            className={`min-h-20 rounded-md border px-2 py-3 text-center transition ${selectedDay?.id === day.id ? 'border-wine-700 bg-wine-700 text-cream-50 shadow-sm' : 'border-wine-900/15 bg-[#f6f2e8] text-wine-900'}`}
          >
            <span className="block text-3xl font-black leading-none">{day.day}</span>
            <span className="mt-1 block text-xs font-black uppercase tracking-[0.08em]">{day.month}</span>
          </button>
        ))}
      </div>

      {selectedDay ? (
        <section className="overflow-hidden rounded-lg border border-wine-900/15 bg-[#f6f2e8] shadow-sm">
          <div className="border-b border-dashed border-wine-900/25 px-5 py-6 text-center">
            <p className="text-7xl font-black leading-[0.78] text-gold-600">{selectedDay.day}</p>
            <p className="mt-3 text-xl font-black uppercase leading-none text-wine-700">{selectedDay.month}</p>
            <p className="text-2xl font-light leading-none text-wine-700/70">{selectedDay.year}</p>
            <div className="mx-auto mt-5 h-px w-20 bg-wine-700/35" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-wine-700">Menù del giorno</p>
          </div>

          <div className="space-y-0 px-5 py-2">
            {selectedDay.dishes.map((dish, index) => (
              <article key={dish} className="grid grid-cols-[34px_1fr] gap-3 border-b border-dashed border-wine-900/18 py-5 last:border-b-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-600/45 text-xs font-black text-gold-700">
                  {index + 1}
                </span>
                <p className="text-left text-2xl font-black leading-snug text-wine-900">{dish}</p>
              </article>
            ))}
          </div>

          {selectedDay.note ? (
            <div className="mx-5 mb-5 flex items-center justify-center gap-3 rounded-md bg-olive-700 px-4 py-4 text-cream-50">
              <Droplets className="h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-[0.08em]">{selectedDay.note}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-lg border border-wine-900/15 bg-[#f6f2e8] px-5 py-4 text-center shadow-sm">
        <p className="text-sm font-semibold leading-6 text-stone-600">
          Scopri ogni giorno un nuovo menù ispirato ai sapori autentici della Puglia.
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
          Primo, specialità del giorno e bottiglia d'acqua naturale 0,50 L inclusa.
        </p>
        <p className="mt-3 text-[0.6rem] font-black uppercase tracking-[0.16em] text-stone-600">
          * tiket {selectedDay?.price ?? '€7'}
        </p>
      </section>
    </div>
  )
}
