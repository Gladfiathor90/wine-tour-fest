import { Trophy } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { SponsorLevel } from '../../types/content'

function partnerLevelLabel(level: SponsorLevel) {
  if (level === 'Main sponsor') return 'Main partner'
  if (level === 'Sponsor') return 'Partner'
  return level
}

export function SponsorsPage() {
  const sponsors = contentService.sponsors.demoList()
  const organizer = sponsors.find((sponsor) => sponsor.name === 'Comune di Lizzano')
  const partnerList = sponsors.filter((sponsor) => sponsor.id !== organizer?.id)

  usePageMeta('Partners', 'Partners Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Partners" />
      <SectionHeader eyebrow="Partners" title="Partners" description="Istituzioni, associazioni e realta del territorio che sostengono il Wine Tour Fest." />
      {!sponsors.length ? <EmptyState icon={Trophy} title="Nessun partner pubblicato" description="I loghi saranno visibili appena pubblicati dall'organizzazione." /> : null}
      {organizer ? (
        <section className="rounded-lg border border-wine-700/25 bg-cream-50 p-5 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-wine-700">Ente organizzatore dell'evento</p>
          <div className="mx-auto mt-4 grid h-36 max-w-56 place-items-center rounded-md bg-[#f6f2e8] px-4">
            <img src={organizer.logoUrl} alt={`Logo ${organizer.name}`} className="max-h-32 max-w-full object-contain" loading="eager" decoding="async" />
          </div>
          <h2 className="mt-4 text-2xl font-black leading-tight text-stone-950">{organizer.name}</h2>
        </section>
      ) : null}
      <section className="grid gap-3">
        {partnerList.map((sponsor) => (
          <article key={sponsor.id} className="grid min-h-48 gap-4 rounded-lg border border-stone-200 bg-white p-5 text-center shadow-sm">
            <div className="grid h-36 place-items-center rounded-md bg-[#f6f2e8] px-4">
              <img src={sponsor.logoUrl} alt={`Logo ${sponsor.name}`} className="max-h-32 max-w-full object-contain" loading="eager" decoding="async" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-wine-700">{partnerLevelLabel(sponsor.level)}</p>
              <h3 className="text-lg font-bold leading-tight text-stone-950">{sponsor.name}</h3>
              {sponsor.description ? <p className="text-sm font-medium leading-relaxed text-stone-600">{sponsor.description}</p> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
