import { LockKeyhole } from 'lucide-react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { isSupabaseConfigured } from '../../lib/supabase'

export function AdminLoginPage() {
  usePageMeta('Login admin', 'Accesso amministrativo demo Wine Tour Fest.')
  return (
    <section className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <LockKeyhole className="h-8 w-8 text-wine-700" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold text-stone-950">Login admin</h1>
      <p className="mt-2 text-sm text-stone-600">
        {isSupabaseConfigured ? 'Pronto per autenticazione Supabase.' : 'Modalita demo: Supabase non e configurato, nessun accesso reale viene eseguito.'}
      </p>
      <form className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-stone-700">Email<input className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" placeholder="admin@winetourfest.it" /></label>
        <label className="block text-sm font-semibold text-stone-700">Password<input type="password" className="mt-1 min-h-12 w-full rounded-md border border-stone-300 px-3 text-sm" placeholder="Password" /></label>
        <button type="button" className="min-h-12 w-full rounded-md bg-stone-950 px-4 text-sm font-semibold text-white">Entra in modalita demo</button>
      </form>
    </section>
  )
}
