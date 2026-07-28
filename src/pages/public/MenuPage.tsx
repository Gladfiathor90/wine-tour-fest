import { CalendarDays, Gamepad2, Info, Mail, Newspaper, Shield, Trophy, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { QrScannerButton } from '../../components/common/QrScannerButton'
import { usePageMeta } from '../../hooks/usePageMeta'
import { publicRoutes } from '../../utils/routes'

const items = [
  { label: 'News', path: publicRoutes.news, icon: Newspaper },
  { label: 'Programma', path: publicRoutes.events, icon: CalendarDays },
  { label: 'Gastronomia', path: publicRoutes.gastronomy, icon: Utensils },
  { label: 'Informazioni utili', path: publicRoutes.info, icon: Info },
  { label: 'Sponsor', path: publicRoutes.sponsors, icon: Trophy },
  { label: 'Gioca', path: publicRoutes.game, icon: Gamepad2 },
  { label: 'Contatti', path: publicRoutes.info, icon: Mail },
  { label: 'Privacy', path: publicRoutes.privacy, icon: Shield },
]

export function MenuPage() {
  usePageMeta('Menu', 'Menu secondario Wine Tour Fest.')
  return (
    <div className="space-y-5">
      <PublicHeader title="Menu" />
      <h1 className="text-3xl font-bold text-stone-950">Menu</h1>
      <QrScannerButton />
      <div className="grid gap-3">
        {items.map((item) => (
          <Link key={`${item.label}-${item.path}`} to={item.path} className="flex min-h-16 items-center gap-4 rounded-lg bg-white p-4 text-lg font-semibold text-stone-950 shadow-sm">
            <item.icon className="h-6 w-6 text-wine-700" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
