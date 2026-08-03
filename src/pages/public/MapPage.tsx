import 'leaflet/dist/leaflet.css'
import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import { publicRoutes } from '../../utils/routes'

const mainStageCenter: [number, number] = [40.388910396877094, 17.44846098820777]

const filters = [
  { label: 'Tutto', value: 'all' },
  { label: 'Cantine', value: 'winery' },
  { label: 'Palco', value: 'main' },
  { label: 'Luoghi', value: 'venue' },
  { label: 'Gastronomia', value: 'poi' },
  { label: 'Info point', value: 'info' },
] as const

const categoryLabels = {
  winery: 'Cantine',
  info: 'Info point',
  toilet: 'Servizi',
  poi: 'Gastronomia',
  main: 'Palco',
  venue: 'Luoghi',
} as const

export function MapPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all')
  const points = contentService.mapPoints.demoList()
  const wineries = contentService.wineries.demoList()
  usePageMeta('Mappa', 'Mappa OpenStreetMap del Wine Tour Fest.')

  const visiblePoints = useMemo(() => points.filter((point) => {
    if (filter === 'all') return true
    return point.category === filter
  }), [filter, points])

  return (
    <div className="space-y-5">
      <PublicHeader title="Mappa" />
      <SectionHeader eyebrow="Mappa" title="Orientati nel festival" description="Palco centrale, cantine, gastronomia e info point su OpenStreetMap." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-semibold ${filter === item.value ? 'bg-wine-700 text-white' : 'bg-white text-stone-700'}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="relative z-0 mb-24 h-[62svh] min-h-[420px] overflow-hidden rounded-lg border border-stone-200 shadow-sm">
        <MapContainer center={mainStageCenter} zoom={19} maxZoom={19} scrollWheelZoom={false} className="wtf-leaflet-map h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap contributors' maxZoom={19} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {visiblePoints.map((point) => {
            const linkedWinery = wineries.find((winery) => winery.id === point.wineryId)
            return (
              <CircleMarker key={point.id} center={[point.latitude, point.longitude]} radius={14} pathOptions={{ color: point.category === 'winery' ? '#8b1e3f' : '#5f6f3f', fillOpacity: 0.9 }}>
                <Popup>
                  <div className="space-y-2">
                    <strong>{point.name}</strong>
                    <p>{point.description}</p>
                    <p>{point.address}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`} target="_blank" rel="noreferrer">
                      Indicazioni
                    </a>
                    {linkedWinery ? <br /> : null}
                    {linkedWinery ? <Link to={publicRoutes.wineryDetail(linkedWinery.slug)}>Apri scheda</Link> : null}
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      <div className="grid gap-3">
        {visiblePoints.map((point) => {
          const linkedWinery = wineries.find((winery) => winery.id === point.wineryId)
          return (
            <article key={point.id} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">{categoryLabels[point.category]}</p>
              <h2 className="mt-1 text-lg font-semibold text-stone-950">{point.name}</h2>
              <p className="mt-1 text-sm text-stone-600">{point.description}</p>
              <div className="mt-3 flex flex-col gap-2">
                <a className="wtf-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wine-700 px-3 text-sm font-semibold text-white" href={`https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Indicazioni
                </a>
                {linkedWinery ? <Link className="wtf-button-primary inline-flex min-h-11 items-center justify-center rounded-md bg-wine-700 px-3 text-sm font-semibold text-white" to={publicRoutes.wineryDetail(linkedWinery.slug)}>Apri scheda</Link> : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
