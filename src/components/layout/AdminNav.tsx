import { LogOut, Wine } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { adminSections } from '../../data/demoData'
import { adminRoutes } from '../../utils/routes'

export function AdminNav() {
  return (
    <aside className="border-b border-stone-200 bg-stone-950 text-white">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-wine-700">
          <Wine className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold">Wine Tour Fest</p>
          <p className="text-xs text-stone-400">Area amministrativa</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4">
        <NavLink
          to={adminRoutes.dashboard}
          end
          className={({ isActive }) =>
            `whitespace-nowrap rounded-md px-3 py-2 text-sm ${isActive ? 'bg-white text-stone-950' : 'text-stone-300 hover:bg-stone-800'}`
          }
        >
          Dashboard
        </NavLink>
        {adminSections.slice(0, 8).map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            className={({ isActive }) =>
              `flex whitespace-nowrap rounded-md px-3 py-2 text-sm ${isActive ? 'bg-white text-stone-950' : 'text-stone-300 hover:bg-stone-800'}`
            }
          >
            {section.label}
          </NavLink>
        ))}
        <NavLink
          to={adminRoutes.login}
          className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm text-stone-300 hover:bg-stone-800"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Login
        </NavLink>
      </nav>
    </aside>
  )
}
