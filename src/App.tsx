import { Suspense, lazy, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SplashScreen } from './components/common/SplashScreen'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminEventsPage } from './pages/admin/AdminEventsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminNewsPage } from './pages/admin/AdminNewsPage'
import { AdminQrPage } from './pages/admin/AdminQrPage'
import { AdminSectionPage } from './pages/admin/AdminSectionPage'
import { AdminSponsorsPage } from './pages/admin/AdminSponsorsPage'
import { AdminWineriesPage } from './pages/admin/AdminWineriesPage'
import { EventDetailPage } from './pages/public/EventDetailPage'
import { EventsPage } from './pages/public/EventsPage'
import { GamePage } from './pages/public/GamePage'
import { GastronomyPage } from './pages/public/GastronomyPage'
import { HomePage } from './pages/public/HomePage'
import { InfoPage } from './pages/public/InfoPage'
import { NewsPage } from './pages/public/NewsPage'
import { NewsDetailPage } from './pages/public/NewsDetailPage'
import { NotFoundPage } from './pages/public/NotFoundPage'
import { OliveMillDetailPage } from './pages/public/OliveMillDetailPage'
import { OliveMillsPage } from './pages/public/OliveMillsPage'
import { MenuPage } from './pages/public/MenuPage'
import { PrivacyPage } from './pages/public/PrivacyPage'
import { SponsorsPage } from './pages/public/SponsorsPage'
import { SocialPage } from './pages/public/SocialPage'
import { WineriesPage } from './pages/public/WineriesPage'
import { WineryCheckInPage } from './pages/public/WineryCheckInPage'
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
      { path: publicRoutes.oliveMills, element: <OliveMillsPage /> },
      { path: '/frantoi/:slug', element: <OliveMillDetailPage /> },
      { path: '/check-in/:slug', element: <WineryCheckInPage /> },
      { path: publicRoutes.events, element: <EventsPage /> },
      { path: '/eventi/:slug', element: <EventDetailPage /> },
      { path: publicRoutes.news, element: <NewsPage /> },
      { path: '/news/:slug', element: <NewsDetailPage /> },
      { path: publicRoutes.map, element: <Suspense fallback={<div className="p-5 text-sm text-stone-600">Caricamento mappa...</div>}><MapPage /></Suspense> },
      { path: publicRoutes.info, element: <InfoPage /> },
      { path: publicRoutes.sponsors, element: <SponsorsPage /> },
      { path: publicRoutes.partners, element: <SponsorsPage /> },
      { path: publicRoutes.gastronomy, element: <GastronomyPage /> },
      { path: publicRoutes.game, element: <GamePage /> },
      { path: publicRoutes.social, element: <SocialPage /> },
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
      { path: 'cantine', element: <AdminWineriesPage /> },
      { path: 'cantine/nuova', element: <AdminWineriesPage /> },
      { path: 'cantine/:id', element: <AdminWineriesPage /> },
      { path: 'eventi', element: <AdminEventsPage /> },
      { path: 'eventi/nuovo', element: <AdminEventsPage /> },
      { path: 'eventi/:id', element: <AdminEventsPage /> },
      { path: 'news', element: <AdminNewsPage /> },
      { path: 'news/nuova', element: <AdminNewsPage /> },
      { path: 'news/:id', element: <AdminNewsPage /> },
      { path: 'mappa', element: <AdminSectionPage /> },
      { path: 'sponsor', element: <AdminSponsorsPage /> },
      { path: 'sponsor/nuovo', element: <AdminSponsorsPage /> },
      { path: 'sponsor/:id', element: <AdminSponsorsPage /> },
      { path: 'qr', element: <AdminQrPage /> },
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
