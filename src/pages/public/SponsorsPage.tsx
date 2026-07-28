import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { SponsorLevel } from '../../types/content'

const levels: SponsorLevel[] = ['Main sponsor', 'Partner', 'Sponsor', 'Patrocini', 'Associazioni']

export function SponsorsPage() {
  const sponsors = contentService.sponsors.demoList()
  usePageMeta('Sponsor', 'Sponsor e partner Wine Tour Fest.')

  return (
    <div className="space-y-5">
      <PublicHeader back title="Sponsor" />
      <SectionHeader eyebrow="Sponsor" title="Sponsor e partner" description="Loghi proporzionati e ordinati per livello." />
      {levels.map((level) => {
        const group = sponsors.filter((sponsor) => sponsor.level === level)
        if (!group.length) return null
        return (
          <section key={level} className="space-y-3">
            <h2 className="text-xl font-bold text-stone-950">{level}</h2>
            <div className="grid gap-3">
              {group.map((sponsor) => {
                const content = (
                  <article className="flex min-h-20 items-center gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                    <img src={sponsor.logoUrl} alt={`Logo ${sponsor.name}`} className="h-14 w-14 object-contain" loading="lazy" />
                    <div>
                      <h3 className="font-semibold text-stone-950">{sponsor.name}</h3>
                      <p className="text-sm text-stone-500">{sponsor.level}</p>
                    </div>
                  </article>
                )
                return sponsor.website ? <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer">{content}</a> : <div key={sponsor.id}>{content}</div>
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
