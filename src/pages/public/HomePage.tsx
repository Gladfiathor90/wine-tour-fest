import { CalendarDays, Droplets, Gamepad2, Grape, Info, Mail, MapPinned, MessageCircle, Newspaper, Shield, Trophy, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../../components/common/Logo'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'

const quickLinks = [
  { label: 'Programma', path: publicRoutes.events, icon: CalendarDays },
  { label: 'Gastronomia', path: publicRoutes.gastronomy, icon: Utensils },
  { label: 'Cantine', path: publicRoutes.wineries, icon: Grape },
  { label: 'Frantoi', path: publicRoutes.oliveMills, icon: Droplets },
  { label: 'News', path: publicRoutes.news, icon: Newspaper },
  { label: 'Mappa', path: publicRoutes.map, icon: MapPinned },
  { label: 'Partners', path: publicRoutes.partners, icon: Trophy },
  { label: 'Gioca e vinci', path: publicRoutes.game, icon: Gamepad2 },
  { label: 'Social', path: publicRoutes.social, icon: MessageCircle },
  { label: 'Informazioni utili', path: publicRoutes.info, icon: Info },
  { label: 'Contatti', path: publicRoutes.contacts, icon: Mail },
  { label: 'Privacy', path: publicRoutes.privacy, icon: Shield },
]

export function HomePage() {
  const info = contentService.generalInfo.demo()
  const wineryLogos = contentService.wineries.demoList().filter((winery) => winery.published)
  const oliveMillLogos = contentService.oliveMills.demoList().filter((mill) => mill.published)
  const producerLogos = [
    ...wineryLogos.map((winery) => ({ ...winery, producerType: 'winery' as const })),
    ...oliveMillLogos.map((mill) => ({ ...mill, producerType: 'oliveMill' as const })),
  ]
  const carouselLogos = [...producerLogos, ...producerLogos]

  usePageMeta('Home', info.description)

  return (
    <div className="space-y-7">
      <section className="rounded-lg bg-[#f6f2e8] px-5 py-7 text-center shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-4xl font-black leading-tight text-wine-900">
          <span className="block">Benvenuti al</span>
          <span className="block">Wine Tour Fest</span>
          <span className="block">di Lizzano</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[25rem] text-xl font-medium leading-[1.65] text-stone-600">
          Preparati a vivere un'esperienza unica tra vino, cultura, gastronomia e spettacoli. Passeggia tra le cantine, scopri i produttori locali e lasciati conquistare dall'atmosfera del Centro Storico.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {quickLinks.map((item) => (
          <Link key={`${item.label}-${item.path}`} to={item.path} className="flex aspect-[1.12] flex-col items-center justify-center gap-7 rounded-lg border border-stone-200 bg-[#f6f2e8] p-4 text-center shadow-sm">
            <item.icon className="h-9 w-9 text-wine-700" strokeWidth={2.4} aria-hidden="true" />
            <span className="text-lg font-bold leading-tight text-wine-900">{item.label}</span>
          </Link>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-[#f6f2e8] py-5 shadow-sm">
        <div className="wtf-logo-carousel flex w-max items-center gap-8 px-6">
          {carouselLogos.map((producer, index) => (
            <Link
              key={`${producer.id}-${index}`}
              to={producer.producerType === 'winery' ? publicRoutes.wineryDetail(producer.slug) : publicRoutes.oliveMillDetail(producer.slug)}
              className="grid h-20 w-32 shrink-0 place-items-center rounded-md bg-[#f6f2e8] px-3"
            >
              <img src={producer.logoUrl} alt={`Logo ${producer.name}`} className="max-h-14 max-w-full object-contain" loading="eager" decoding="async" />
            </Link>
          ))}
        </div>
      </section>

      <footer className="space-y-2 border-t border-stone-200 pt-5 text-center text-sm text-stone-600">
        <p className="font-semibold text-stone-950">{info.eventName}</p>
        <p>{info.email} · {info.phone}</p>
        <p className="font-semibold">
          Progettazione e sviluppo a cura di TarantaTech{' '}
          <a className="font-bold text-wine-700" href="http://www.tarantatech.it" target="_blank" rel="noreferrer">
            www.tarantatech.it
          </a>
        </p>
      </footer>
    </div>
  )
}
