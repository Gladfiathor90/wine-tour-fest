const logoPath = '/logos/wine%20tour%20fest%20svg.svg'

type SplashScreenProps = {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#062236] px-6 text-center transition-opacity duration-700',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      aria-hidden={!isVisible}
    >
      <img
        src={logoPath}
        alt="Wine Tour Fest"
        className="max-h-[78svh] w-full max-w-[430px] object-contain"
        decoding="async"
      />
      <div className="sr-only">Wine Tour Fest</div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
        Wine Tour Fest
      </p>
    </div>
  )
}
