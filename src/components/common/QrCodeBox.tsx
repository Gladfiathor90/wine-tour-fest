import { QRCodeSVG } from 'qrcode.react'

type QrCodeBoxProps = {
  url: string
  title?: string
}

export function QrCodeBox({ url, title = 'QR Code pagina' }: QrCodeBoxProps) {
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`

  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-stone-950">{title}</h2>
      <p className="mt-1 text-sm text-stone-600">Apre la pagina di check-in della cantina e registra la visita.</p>
      <div className="mt-4 grid place-items-center rounded-md bg-cream-50 p-4">
        <QRCodeSVG value={fullUrl} size={150} level="M" />
      </div>
      <p className="mt-3 break-all text-xs text-stone-500">{fullUrl}</p>
    </aside>
  )
}
