import { Mail, Phone, Wrench } from 'lucide-react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'

export function ContactsPage() {
  usePageMeta('Contatti', 'Supporto tecnico Web App Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Contatti" />
      <SectionHeader eyebrow="Supporto" title="Contatti" description="Assistenza tecnica per la Web App Wine Tour Fest." />

      <section className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-center shadow-sm">
        <h2 className="text-xl font-bold leading-tight text-stone-950">Wine Tour Fest</h2>
        <div className="mt-4 grid gap-2 text-sm font-semibold text-stone-600">
          <a href="mailto:winetourfest@gmail.com" className="inline-flex min-h-10 items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-wine-700" aria-hidden="true" />
            winetourfest@gmail.com
          </a>
          <a href="tel:0999558603" className="inline-flex min-h-10 items-center justify-center gap-2">
            <Phone className="h-4 w-4 text-wine-700" aria-hidden="true" />
            099 9558603
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-[#f6f2e8] p-5 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-wine-700 text-cream-50">
          <Wrench className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold leading-tight text-stone-950">Supporto tecnico app</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-stone-600">
          Per problemi tecnici, malfunzionamenti o segnalazioni relative alla Web App scrivi a:
        </p>
        <a href="mailto:info@tarantatech.it" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-bold text-white">
          <Mail className="h-4 w-4" aria-hidden="true" />
          info@tarantatech.it
        </a>
      </section>
    </div>
  )
}
