import { CalendarDays, Gamepad2, Info, Mail, MapPinned, Newspaper, Shield, Trophy, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { QrScannerButton } from '../../components/common/QrScannerButton'
import { usePageMeta } from '../../hooks/usePageMeta'
import { publicRoutes } from '../../utils/routes'

const items = [
  { label: 'Programma', path: publicRoutes.events, icon: CalendarDays },
  { label: 'Gastronomia', path: publicRoutes.gastronomy, icon: Utensils },
  { label: 'News', path: publicRoutes.news, icon: Newspaper },
  { label: 'Mappa', path: publicRoutes.map, icon: MapPinned },
  { label: 'Partners', path: publicRoutes.partners, icon: Trophy },
  { label: 'Gioca e vinci', path: publicRoutes.game, icon: Gamepad2 },
  { label: 'Informazioni e ticket', path: publicRoutes.info, icon: Info },
  { label: 'Contatti', path: publicRoutes.contacts, icon: Mail },
  { label: 'Privacy', path: publicRoutes.privacy, icon: Shield },
]

export function MenuPage() {
  usePageMeta('Menu', 'Menu secondario Wine Tour Fest.')
  return (
    <div className="space-y-5">
      <PublicHeader title="Menu" />
      <h1 className="text-3xl font-bold text-stone-950">Menu</h1>
      <QrScannerButton />
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={`${item.label}-${item.path}`} to={item.path} className="flex aspect-[1.12] flex-col items-center justify-center gap-5 rounded-lg border border-stone-200 bg-[#f6f2e8] p-4 text-center text-lg font-semibold text-stone-950 shadow-sm">
            <item.icon className="h-8 w-8 text-wine-700" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <footer className="border-t border-stone-200 pt-5 text-sm text-stone-600">
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
