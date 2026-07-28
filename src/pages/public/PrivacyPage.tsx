import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { publicRoutes } from '../../utils/routes'

export function PrivacyPage() {
  usePageMeta('Privacy', 'Informativa privacy Wine Tour Fest.')
  return (
    <div className="space-y-5">
      <PublicHeader back title="Privacy" />
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-stone-950">Informativa privacy</h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Questa versione demo della web app non richiede registrazione visitatori e non raccoglie dati personali per check-in, punti, classifiche o profili pubblici.
        </p>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Il mini gioco salva solo record e codice premio nel localStorage del dispositivo. Eventuali collegamenti esterni aprono servizi terzi con proprie informative.
        </p>
      </section>
      <Link className="inline-flex min-h-11 items-center font-semibold text-wine-700" to={publicRoutes.home}>Torna alla home</Link>
    </div>
  )
}
