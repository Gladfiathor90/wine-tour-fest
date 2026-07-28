import 'leaflet/dist/leaflet.css'
import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/common/PublicHeader'
import { SectionHeader } from '../../components/common/SectionHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { MapPointCategory } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

const filters = [
  { label: 'Tutto', value: 'all' },
  { label: 'Cantine', value: 'winery' },
  { label: 'Parcheggi', value: 'parking' },
  { label: 'Servizi', value: 'services' },
] as const

const serviceCategories: MapPointCategory[] = ['info', 'toilet', 'shuttle', 'poi', 'main']

export function MapPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all')
  const points = contentService.mapPoints.demoList()
  const wineries = contentService.wineries.demoList()
  usePageMeta('Mappa', 'Mappa OpenStreetMap del Wine Tour Fest con cantine e servizi.')

  const visiblePoints = useMemo(() => points.filter((point) => {
    if (filter === 'all') return true
    if (filter === 'services') return serviceCategories.includes(point.category)
    return point.category === filter
  }), [filter, points])

  return (
    <div className="space-y-5">
      <PublicHeader title="Mappa" />
      <SectionHeader eyebrow="Mappa" title="Orientati nel festival" description="Cantine, parcheggi, servizi e area principale su OpenStreetMap." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`min-h-11 whitespace-nowrap rounded-md px-4 text-sm font-semibold ${filter === item.value ? 'bg-wine-700 text-white' : 'bg-white text-stone-700'}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="h-[62svh] min-h-[420px] overflow-hidden rounded-lg border border-stone-200 shadow-sm">
        <MapContainer center={[40.39194, 17.44833]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {visiblePoints.map((point) => {
            const linkedWinery = wineries.find((winery) => winery.id === point.wineryId)
            return (
              <CircleMarker key={point.id} center={[point.latitude, point.longitude]} radius={9} pathOptions={{ color: point.category === 'winery' ? '#8b1e3f' : '#5f6f3f', fillOpacity: 0.9 }}>
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">{point.category}</p>
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
