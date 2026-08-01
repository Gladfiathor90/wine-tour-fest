import { MapPinned, Navigation } from 'lucide-react'

export function MapPlaceholder() {
  return (
    <div className="relative min-h-80 overflow-hidden rounded-lg border border-stone-200 bg-stone-200">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute left-1/4 top-1/3 h-4 w-4 rounded-full bg-wine-700 ring-4 ring-white" />
      <div className="absolute right-1/4 top-1/2 h-4 w-4 rounded-full bg-gold-600 ring-4 ring-white" />
      <div className="absolute bottom-1/4 left-1/2 h-4 w-4 rounded-full bg-leaf-700 ring-4 ring-white" />
      <div className="relative flex min-h-80 flex-col items-center justify-center p-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-white shadow-sm">
          <MapPinned className="h-7 w-7 text-wine-700" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-stone-950">Mappa del festival</h2>
        <p className="mt-2 max-w-sm text-sm text-stone-600">
          Placeholder per cantine, palco centrale, gastronomia e info point.
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Percorsi in arrivo
        </button>
      </div>
    </div>
  )
}
