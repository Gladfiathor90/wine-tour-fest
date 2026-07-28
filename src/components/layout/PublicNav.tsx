import { Grape, Home, MapPinned, Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { QrScannerButton } from '../common/QrScannerButton'
import { publicRoutes } from '../../utils/routes'

const navItems = [
  { label: 'Home', path: publicRoutes.home, icon: Home },
  { label: 'Cantine', path: publicRoutes.wineries, icon: Grape },
  { label: 'Mappa', path: publicRoutes.map, icon: MapPinned },
  { label: 'Menu', path: publicRoutes.menu, icon: Menu },
]

export function PublicNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-gold-500/40 bg-wine-900/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-soft backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {navItems.slice(0, 2).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === publicRoutes.home}
            className={({ isActive }) =>
              [
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[11px] font-bold uppercase tracking-[0.04em] transition',
                isActive ? 'wtf-nav-active bg-gold-500 text-wine-900' : 'text-cream-50 hover:bg-cream-50/10',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <QrScannerButton variant="nav" />
        {navItems.slice(2).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[11px] font-bold uppercase tracking-[0.04em] transition',
                isActive ? 'wtf-nav-active bg-gold-500 text-wine-900' : 'text-cream-50 hover:bg-cream-50/10',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
