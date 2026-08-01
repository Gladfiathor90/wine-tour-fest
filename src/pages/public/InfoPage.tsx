import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'

const tickets = [
  {
    name: 'Degusta',
    description: '1 singola degustazione vino',
    price: '€ 1,00',
    theme: 'border-[#7a7717]/55 bg-[#d7d172] text-[#626000]',
  },
  {
    name: 'Kit Degusta',
    description: '1 calice e borsetta porta calice + 1 degustazione vino',
    price: '€ 8,00',
    theme: 'border-[#15572b]/55 bg-[#b8d0ab] text-[#0f5427]',
  },
  {
    name: 'Appetizer',
    description: '1 aperitivo di prodotti tipici locali, stuzzichini e finger food + 1 bottiglietta acqua',
    price: '€ 8,00',
    theme: 'border-[#0d56a3]/55 bg-[#9ee6f7] text-[#064f9b]',
  },
  {
    name: 'Food',
    description: '1 degustazione piatti tipici locali + 1 bottiglietta acqua',
    price: '€ 10,00',
    theme: 'border-[#8b1025]/55 bg-[#d8a18e] text-[#8b1025]',
  },
  {
    name: 'Masterclass',
    description: '1 Masterclass di I.P.S.S.E.O.A. Mediterraneo e A.I.S. Associazione Italiana Sommelier',
    price: '€ 30,00',
    theme: 'border-[#7a268f]/55 bg-[#b78cff] text-[#7a0f35]',
  },
]

export function InfoPage() {
  const info = contentService.generalInfo.demo()
  const [open, setOpen] = useState(info.usefulInfo[0]?.title)
  usePageMeta('Informazioni e ticket', 'Informazioni e ticket Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Informazioni e ticket" />
      <SectionHeader eyebrow="Info" title="Informazioni e ticket" description="Tutte le informazioni operative e le tipologie di ticket disponibili durante il festival." />
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
      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-5 text-left shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-wine-700">Ticket</p>
          <h2 className="text-2xl font-bold text-stone-950">Tipologie disponibili</h2>
          <p className="text-sm font-semibold leading-6 text-stone-600">
            Informazioni sui ticket acquistabili durante l’evento.
          </p>
        </div>
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <article key={ticket.name} className={`rounded-lg border p-4 text-center shadow-sm ${ticket.theme}`}>
              <h3 className="text-2xl font-black uppercase tracking-[0.04em]">{ticket.name}</h3>
              <p className="mx-auto mt-2 max-w-sm text-base font-bold leading-6">{ticket.description}</p>
              <p className="mt-3 text-sm font-black text-stone-950">{ticket.price}</p>
            </article>
          ))}
        </div>
        <div className="rounded-md bg-wine-900 px-4 py-4 text-center text-cream-50">
          <p className="text-sm font-bold leading-6">I ticket si acquistano presso gli Info Point indicati nella mappa.</p>
          <Link to={publicRoutes.map} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-gold-500 px-4 text-sm font-black uppercase tracking-[0.08em] text-wine-900">
            Apri la mappa
          </Link>
        </div>
      </section>
      <section id="contatti" className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-stone-950">Contatti</h2>
        <p className="mt-3 text-sm font-semibold text-stone-600">{info.email}</p>
        <p className="mt-1 text-sm font-semibold text-stone-600">{info.phone}</p>
        <a href={info.website} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md border border-wine-700 px-4 text-sm font-black uppercase tracking-[0.08em] text-wine-700">
          Portale Comune di Lizzano
        </a>
      </section>
    </div>
  )
}
