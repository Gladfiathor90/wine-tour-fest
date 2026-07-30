import { Download, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'
import type { Winery } from '../../types/content'
import { publicRoutes } from '../../utils/routes'

function downloadQr(id: string, name: string) {
  const canvas = document.getElementById(id)
  if (!(canvas instanceof HTMLCanvasElement)) return
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `qr-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'cantina'}.png`
  link.click()
}

export function AdminQrPage() {
  const [wineries, setWineries] = useState<Winery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageMeta('Admin QR Code', 'QR Code check-in cantine Wine Tour Fest.')

  useEffect(() => {
    let cancelled = false

    async function loadWineries() {
      try {
        setLoading(true)
        setError('')
        const result = await contentService.wineries.getAll()
        if (!cancelled) setWineries(result)
      } catch {
        if (!cancelled) setError('Non riesco a caricare le cantine da Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadWineries()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wine-700">Gestione</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">QR Code</h1>
        <p className="mt-2 text-sm text-stone-600">Ogni QR apre una pagina di check-in univoca per la cantina.</p>
      </div>
      {loading ? <p className="rounded-lg bg-white p-5 text-sm font-semibold text-stone-600 shadow-sm">Caricamento QR...</p> : null}
      {error ? <EmptyState icon={QrCode} title="QR non disponibili" description={error} /> : null}
      {!loading && !error && !wineries.length ? <EmptyState icon={QrCode} title="Nessuna cantina" description="Aggiungi una cantina per generare il QR." /> : null}
      <div className="grid gap-3">
        {wineries.map((winery) => {
          const qrId = `qr-${winery.id}`
          const url = `${window.location.origin}${publicRoutes.wineryCheckIn(winery.slug)}`
          return (
            <article key={winery.id} className="rounded-lg bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-stone-950">{winery.name}</h2>
              <p className="mt-1 break-all text-xs text-stone-500">{url}</p>
              <div className="mt-4 grid place-items-center rounded-md bg-cream-50 p-4">
                <QRCodeCanvas id={qrId} value={url} size={180} level="M" />
              </div>
              <button type="button" onClick={() => downloadQr(qrId, winery.name)} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-3 text-sm font-semibold text-white">
                <Download className="h-4 w-4" /> Scarica QR
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
