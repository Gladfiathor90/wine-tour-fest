import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center">
      <Icon className="mx-auto h-8 w-8 text-wine-700" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-semibold text-stone-950">{title}</h2>
      <p className="mt-1 text-sm text-stone-600">{description}</p>
    </div>
  )
}
