import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

export function InfoPage() {
  const info = contentService.generalInfo.demo()
  const [open, setOpen] = useState(info.usefulInfo[0]?.title)
  usePageMeta('Informazioni', 'Informazioni utili per visitare Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Informazioni" />
      <SectionHeader eyebrow="Info utili" title="Prima di arrivare" description="Tutte le informazioni operative raccolte in sezioni semplici." />
      <div className="grid gap-3">
        {info.usefulInfo.map((item) => {
          const isOpen = open === item.title
          return (
            <section key={item.title} className="rounded-lg border border-stone-200 bg-white shadow-sm">
              <button type="button" onClick={() => setOpen(isOpen ? '' : item.title)} className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left font-semibold text-stone-950">
                {item.title}
                <ChevronDown className={`h-5 w-5 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isOpen ? <p className="border-t border-stone-100 px-4 py-4 text-sm leading-6 text-stone-600">{item.content}</p> : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
