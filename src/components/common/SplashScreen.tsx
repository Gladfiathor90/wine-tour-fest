const logoPath = '/logos/wine%20tour%20fest%20svg.svg'

type SplashScreenProps = {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#f6f2e8] px-6 text-center transition-opacity duration-700',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      aria-hidden={!isVisible}
    >
      <img
        src={logoPath}
        alt="Wine Tour Fest"
        className="h-72 max-h-[42svh] w-auto max-w-[76vw] scale-[1.28] object-contain"
        decoding="async"
      />
      <div className="sr-only">Wine Tour Fest</div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-wine-900">
        Wine Tour Fest
      </p>
    </div>
  )
}
