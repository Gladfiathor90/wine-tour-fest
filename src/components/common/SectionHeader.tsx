type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-700">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight text-stone-950">{title}</h1>
      {description ? <p className="text-base text-stone-600">{description}</p> : null}
    </div>
  )
}
