const logoPath = '/logos/wine-tour-fest.png'

type LogoProps = {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <img
      src={logoPath}
      alt="Wine Tour Fest"
      className={compact ? 'h-24 w-24 object-contain' : 'h-40 w-40 object-contain'}
      loading="eager"
    />
  )
}
