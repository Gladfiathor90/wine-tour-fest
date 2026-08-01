import { Camera, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type QrScannerButtonProps = {
  variant?: 'default' | 'nav'
}

export function QrScannerButton({ variant = 'default' }: QrScannerButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  function openValue(value: string) {
    if (value.startsWith(window.location.origin) || value.startsWith('/') || value.startsWith('http')) {
      window.location.href = value
    }
  }

  function handleOpen() {
    setMessage('')
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isMobile && window.BarcodeDetector) {
      fileInputRef.current?.click()
      return
    }
    setOpen(true)
  }

  async function handleCapturedImage(file: File | undefined) {
    if (!file) return
    if (!window.BarcodeDetector) {
      setMessage('Il rilevamento QR non e supportato da questo browser.')
      setOpen(true)
      return
    }

    try {
      const bitmap = await createImageBitmap(file)
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      const codes = await detector.detect(bitmap)
      bitmap.close()
      const value = codes[0]?.rawValue
      if (value) {
        openValue(value)
        return
      }
      setMessage('QR non rilevato. Inquadralo meglio e riprova.')
      setOpen(true)
    } catch {
      setMessage('Non riesco a leggere questa immagine. Riprova con la fotocamera.')
      setOpen(true)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
    }
  }, [open])

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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => void handleCapturedImage(event.target.files?.[0])}
      />
      {open ? (
        <div className="fixed inset-0 z-[60] bg-black">
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
          <div className="pointer-events-none absolute inset-x-8 top-1/2 aspect-square -translate-y-1/2 rounded-lg border-2 border-cream-50 shadow-[0_0_0_999px_rgb(0_0_0/0.38)]" />
          <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-black/55 text-white backdrop-blur" aria-label="Chiudi scanner">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <p className="absolute inset-x-5 bottom-8 rounded-md bg-black/55 px-4 py-3 text-center text-sm font-semibold leading-6 text-white backdrop-blur">
            {message || 'Inquadra il QR Code con la fotocamera.'}
          </p>
        </div>
      ) : null}
    </>
  )
}
