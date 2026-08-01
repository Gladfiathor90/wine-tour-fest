const logoPath = '/logos/wine%20tour%20fest%20svg.svg'

type LogoProps = {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className={compact ? 'wtf-logo-frame h-[5.5rem] w-[7.5rem]' : 'wtf-logo-frame h-36 w-44'}>
      <img
        src={logoPath}
        alt="Wine Tour Fest"
        className="h-full w-full scale-[1.28] object-contain"
        loading="eager"
      />
    </span>
  )
}
