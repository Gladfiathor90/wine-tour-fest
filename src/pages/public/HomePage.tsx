import { CalendarDays, Gamepad2, Grape, MapPinned, Sparkles, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { QrScannerButton } from '../../components/common/QrScannerButton'
import { EventCard } from '../../components/events/EventCard'
import { NewsCard } from '../../components/news/NewsCard'
import { imageFallbacks } from '../../data/demoData'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'

const quickLinks = [
  { label: 'Cantine', path: publicRoutes.wineries, icon: Grape },
  { label: 'Programma', path: publicRoutes.events, icon: CalendarDays },
  { label: 'Mappa', path: publicRoutes.map, icon: MapPinned },
  { label: 'Gastronomia', path: publicRoutes.gastronomy, icon: Utensils },
]

export function HomePage() {
  const info = contentService.generalInfo.demo()
  const events = contentService.events.demoList().slice(0, 3)
  const wineries = contentService.wineries.demoList().filter((winery) => winery.featured)
  const news = contentService.news.demoList().slice(0, 2)
  const sponsors = contentService.sponsors.demoList().slice(0, 3)

  usePageMeta('Home', info.description)
  const start = new Date(info.startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
  const end = new Date(info.endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-7">
      <PublicHeader title="Home" />

      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <img src={imageFallbacks.hero} alt="Calici di vino del Wine Tour Fest" className="h-56 w-full object-cover" />
        <div className="space-y-4 p-5">
          <p className="inline-flex items-center gap-2 rounded-md bg-wine-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-wine-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {info.edition}
          </p>
          <div>
            <h1 className="text-4xl font-bold leading-tight text-stone-950">{info.eventName}</h1>
            <p className="mt-2 text-sm font-semibold text-olive-700">
              {start} - {end} · {info.city}, {info.province}
            </p>
            <p className="mt-3 text-base leading-7 text-stone-600">{info.description}</p>
          </div>
          <div className="grid gap-3">
            <Link className="wtf-button-primary inline-flex min-h-12 items-center justify-center rounded-md bg-wine-700 px-4 py-3 text-sm font-semibold text-white" to={publicRoutes.wineries}>
              Scopri le cantine
            </Link>
            <Link className="wtf-button-secondary inline-flex min-h-12 items-center justify-center rounded-md border border-wine-700 bg-cream-100 px-4 py-3 text-sm font-black uppercase tracking-[0.06em] text-wine-700" to={publicRoutes.events}>
              Vedi il programma
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {quickLinks.map((item) => (
          <Link key={item.path} to={item.path} className="flex min-h-24 flex-col justify-between rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <item.icon className="h-6 w-6 text-wine-700" aria-hidden="true" />
            <span className="text-sm font-semibold text-stone-950">{item.label}</span>
          </Link>
        ))}
      </section>

      <QrScannerButton />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-stone-950">Prossimi eventi</h2>
          <Link className="text-sm font-semibold text-wine-700" to={publicRoutes.events}>Vedi tutto</Link>
        </div>
        <div className="grid gap-4">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-950">Cantine in evidenza</h2>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 min-[700px]:-mx-6 min-[700px]:px-6">
          {wineries.map((winery) => (
            <Link key={winery.id} to={publicRoutes.wineryDetail(winery.slug)} className="min-w-[78%] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <img src={winery.coverImageUrl} alt="" className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <h3 className="font-semibold text-stone-950">{winery.name}</h3>
                <p className="mt-1 text-sm text-stone-600">{winery.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-stone-950">News recenti</h2>
        <div className="grid gap-4">{news.map((item) => <NewsCard key={item.id} item={item} />)}</div>
      </section>

      <Link to={publicRoutes.game} className="block rounded-lg bg-wine-700 p-5 text-white shadow-sm">
        <Gamepad2 className="h-7 w-7" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold">Riesci a vincere il calice?</h2>
        <p className="mt-2 text-sm text-white/80">Gioca ora e prova a superare la soglia premio.</p>
      </Link>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Sponsor principali</h2>
        <div className="mt-4 grid gap-3">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="flex items-center gap-3 rounded-md bg-cream-50 p-3">
              <img src={sponsor.logoUrl} alt={`Logo ${sponsor.name}`} className="h-10 w-10 object-contain" loading="lazy" />
              <div>
                <p className="font-semibold text-stone-950">{sponsor.name}</p>
                <p className="text-xs text-stone-500">{sponsor.level}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="space-y-2 border-t border-stone-200 pt-5 text-sm text-stone-600">
        <p className="font-semibold text-stone-950">{info.eventName}</p>
        <p>{info.email} · {info.phone}</p>
        <p>Organizzato da Wine Tour Fest · Social: Instagram e Facebook</p>
        <Link className="inline-flex min-h-11 items-center font-semibold text-wine-700" to={publicRoutes.privacy}>Privacy</Link>
        <p>© 2026 Wine Tour Fest</p>
      </footer>
    </div>
  )
}
