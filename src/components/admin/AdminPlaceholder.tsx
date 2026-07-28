import type { LucideIcon } from 'lucide-react'

type AdminPlaceholderProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function AdminPlaceholder({ title, description, icon: Icon }: AdminPlaceholderProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <Icon className="h-8 w-8 text-wine-700" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold text-stone-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-5 rounded-md bg-stone-100 p-4 text-sm text-stone-600">
        Schermata statica pronta per il collegamento futuro a Supabase.
      </div>
    </section>
  )
}
