import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { publicRoutes } from '../../utils/routes'

export function NotFoundPage() {
  usePageMeta('Pagina non trovata', 'Pagina non trovata Wine Tour Fest.')
  return (
    <div className="space-y-4">
      <PublicHeader back title="404" />
      <EmptyState icon={Search} title="Pagina non trovata" description="Questa sezione non e disponibile o l'indirizzo non e corretto." />
      <Link className="inline-flex min-h-12 items-center rounded-md bg-wine-700 px-4 text-sm font-semibold text-white" to={publicRoutes.home}>
        Torna alla home
      </Link>
    </div>
  )
}
