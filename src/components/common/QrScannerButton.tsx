import { Camera, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type QrScannerButtonProps = {
  variant?: 'default' | 'nav'
}

export function QrScannerButton({ variant = 'default' }: QrScannerButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!open) return
    let interval = 0
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        if (!window.BarcodeDetector) {
          setMessage('Fotocamera aperta. Il rilevamento automatico QR non e supportato da questo browser.')
          return
        }
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        interval = window.setInterval(async () => {
          if (!videoRef.current || cancelled) return
          const codes = await detector.detect(videoRef.current)
          const value = codes[0]?.rawValue
          if (!value) return
          setMessage('QR rilevato, apertura in corso...')
          if (value.startsWith(window.location.origin)) {
            window.location.href = value
          } else if (value.startsWith('/')) {
            window.location.href = value
          } else if (value.startsWith('http')) {
            window.location.href = value
          }
        }, 700)
      } catch {
        setMessage('Non riesco ad aprire la fotocamera. Controlla i permessi del browser.')
      }
    }

    void startCamera()

    return () => {
      cancelled = true
      window.clearInterval(interval)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'nav'
            ? 'qr-wave relative -mt-4 flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 justify-self-center rounded-full bg-wine-700 text-[10px] font-black uppercase tracking-[0.08em] text-cream-50 shadow-soft ring-4 ring-cream-50'
            : 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-wine-700 px-4 text-sm font-semibold text-white shadow-sm'
        }
        aria-label="Scansiona QR Code"
      >
        <Camera className={variant === 'nav' ? 'h-5 w-5' : 'h-5 w-5'} aria-hidden="true" />
        {variant === 'nav' ? 'QR' : 'Scansiona QR Code'}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/90 p-4">
          <section className="w-full max-w-[480px] overflow-hidden rounded-lg bg-cream-50 shadow-soft">
            <div className="flex items-center justify-between border-b border-wine-700/20 p-4">
              <h2 className="text-lg font-bold text-stone-950">Inquadra il QR Code</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-md bg-white text-stone-700" aria-label="Chiudi scanner">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative bg-black">
              <video ref={videoRef} className="aspect-[3/4] w-full object-cover" playsInline muted />
              <div className="pointer-events-none absolute inset-8 rounded-lg border-2 border-dashed border-cream-50" />
            </div>
            <p className="p-4 text-sm leading-6 text-stone-700">
              {message || 'Autorizza la fotocamera e centra il QR nel riquadro.'}
            </p>
          </section>
        </div>
      ) : null}
    </>
  )
}
