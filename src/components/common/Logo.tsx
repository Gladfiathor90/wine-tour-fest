const logoPath = '/logos/wine%20tour%20fest%20svg.svg'

type LogoProps = {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <img
      src={logoPath}
      alt="Wine Tour Fest"
      className={compact ? 'h-24 w-24 object-contain' : 'h-28 w-auto object-contain'}
      loading="eager"
    />
  )
}
