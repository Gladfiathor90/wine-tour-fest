import { Link } from 'react-router-dom'
import { adminSections } from '../../data/demoData'
import { isSupabaseConfigured } from '../../lib/supabase'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { adminRoutes } from '../../utils/routes'

export function AdminDashboardPage() {
  usePageMeta('Admin', 'Dashboard amministrativa demo Wine Tour Fest.')
  const wineries = contentService.wineries.demoList()
  const events = contentService.events.demoList()
  const news = contentService.news.demoList()
  const sponsors = contentService.sponsors.demoList()
  const todayEvents = events.filter((event) => event.startDate === contentService.generalInfo.demo().startDate).length
  const drafts = [...wineries, ...events, ...news].filter((item) => !item.published).length

  const stats = [
    ['Cantine', wineries.length],
    ['Eventi', events.length],
    ['News', news.length],
    ['Partners', sponsors.length],
    ['Bozze', drafts],
    ['Eventi del giorno', todayEvents],
  ]

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Admin demo</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">Pannello di gestione</h1>
        <p className="mt-2 text-sm text-stone-600">
          Supabase {isSupabaseConfigured ? 'configurato' : 'non configurato'}: l’interfaccia usa dati demo e modalita mock.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-stone-950">{value}</p>
            <p className="text-sm text-stone-500">{label}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-3">
        <Link className="min-h-12 rounded-md bg-wine-700 px-4 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.newWinery}>Aggiungi cantina</Link>
        <Link className="min-h-12 rounded-md bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.newEvent}>Aggiungi evento</Link>
        <Link className="min-h-12 rounded-md bg-olive-700 px-4 py-3 text-center text-sm font-semibold text-white" to={adminRoutes.newNews}>Pubblica news</Link>
      </div>
      <div className="grid gap-4">
        {adminSections.slice(0, 8).map((section) => (
          <Link key={section.path} to={section.path} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <section.icon className="h-6 w-6 text-wine-700" aria-hidden="true" />
            <h2 className="mt-3 font-semibold text-stone-950">{section.label}</h2>
            <p className="mt-1 text-sm text-stone-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
