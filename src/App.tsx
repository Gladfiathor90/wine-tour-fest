import { Suspense, lazy, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SplashScreen } from './components/common/SplashScreen'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminSectionPage } from './pages/admin/AdminSectionPage'
import { EventDetailPage } from './pages/public/EventDetailPage'
import { EventsPage } from './pages/public/EventsPage'
import { GamePage } from './pages/public/GamePage'
import { GastronomyPage } from './pages/public/GastronomyPage'
import { HomePage } from './pages/public/HomePage'
import { InfoPage } from './pages/public/InfoPage'
import { NewsPage } from './pages/public/NewsPage'
import { NewsDetailPage } from './pages/public/NewsDetailPage'
import { NotFoundPage } from './pages/public/NotFoundPage'
import { MenuPage } from './pages/public/MenuPage'
import { PrivacyPage } from './pages/public/PrivacyPage'
import { SponsorsPage } from './pages/public/SponsorsPage'
import { WineriesPage } from './pages/public/WineriesPage'
import { WineryDetailPage } from './pages/public/WineryDetailPage'
import { adminRoutes, publicRoutes } from './utils/routes'

const MapPage = lazy(() => import('./pages/public/MapPage').then((module) => ({ default: module.MapPage })))

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: publicRoutes.home, element: <HomePage /> },
      { path: publicRoutes.wineries, element: <WineriesPage /> },
      { path: '/cantine/:slug', element: <WineryDetailPage /> },
      { path: publicRoutes.events, element: <EventsPage /> },
      { path: '/eventi/:slug', element: <EventDetailPage /> },
      { path: publicRoutes.news, element: <NewsPage /> },
      { path: '/news/:slug', element: <NewsDetailPage /> },
      { path: publicRoutes.map, element: <Suspense fallback={<div className="p-5 text-sm text-stone-600">Caricamento mappa...</div>}><MapPage /></Suspense> },
      { path: publicRoutes.info, element: <InfoPage /> },
      { path: publicRoutes.sponsors, element: <SponsorsPage /> },
      { path: publicRoutes.gastronomy, element: <GastronomyPage /> },
      { path: publicRoutes.game, element: <GamePage /> },
      { path: publicRoutes.menu, element: <MenuPage /> },
      { path: publicRoutes.privacy, element: <PrivacyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: adminRoutes.dashboard,
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'login', element: <AdminLoginPage /> },
      { path: 'cantine', element: <AdminSectionPage /> },
      { path: 'cantine/nuova', element: <AdminSectionPage /> },
      { path: 'cantine/:id', element: <AdminSectionPage /> },
      { path: 'eventi', element: <AdminSectionPage /> },
      { path: 'eventi/nuovo', element: <AdminSectionPage /> },
      { path: 'eventi/:id', element: <AdminSectionPage /> },
      { path: 'news', element: <AdminSectionPage /> },
      { path: 'news/nuova', element: <AdminSectionPage /> },
      { path: 'news/:id', element: <AdminSectionPage /> },
      { path: 'mappa', element: <AdminSectionPage /> },
      { path: 'sponsor', element: <AdminSectionPage /> },
      { path: 'informazioni', element: <AdminSectionPage /> },
      { path: 'gioco', element: <AdminSectionPage /> },
      { path: 'gastronomia', element: <AdminSectionPage /> },
      { path: 'impostazioni', element: <AdminSectionPage /> },
    ],
  },
])

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setShowSplash(false)
    }, 1800)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      <RouterProvider router={router} />
    </>
  )
}
