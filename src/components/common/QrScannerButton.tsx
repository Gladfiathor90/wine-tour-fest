import { Camera, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type QrScannerButtonProps = {
  variant?: 'default' | 'nav'
}

export function QrScannerButton({ variant = 'default' }: QrScannerButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  function openValue(value: string) {
    if (value.startsWith(window.location.origin) || value.startsWith('/') || value.startsWith('http')) {
      window.location.href = value
    }
  }

  function handleOpen() {
    setMessage('')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    let interval = 0
    let cancelled = false

    async function startCamera() {
      try {
        document.body.style.overflow = 'hidden'
        let stream: MediaStream
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: 'environment' } },
            audio: false,
          })
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          })
        }
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
          openValue(value)
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
      document.body.style.overflow = ''
    }
  }, [open])

  const scannerOverlay = open
    ? createPortal(
      <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden bg-black">
        <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted autoPlay />
        <div className="pointer-events-none absolute inset-x-8 top-1/2 aspect-square -translate-y-1/2 rounded-lg border-2 border-cream-50 shadow-[0_0_0_999px_rgb(0_0_0/0.38)]" />
        <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] grid h-12 w-12 place-items-center rounded-full bg-black/55 text-white backdrop-blur" aria-label="Chiudi scanner">
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
        <p className="absolute inset-x-5 bottom-[calc(2rem+env(safe-area-inset-bottom))] rounded-md bg-black/55 px-4 py-3 text-center text-sm font-semibold leading-6 text-white backdrop-blur">
          {message || 'Inquadra il QR Code con la fotocamera.'}
        </p>
      </div>,
      document.body,
    )
    : null

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
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
      {scannerOverlay}
    </>
  )
}
