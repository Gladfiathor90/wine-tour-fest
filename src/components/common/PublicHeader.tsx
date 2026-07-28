import { ArrowLeft, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Logo } from './Logo'

type PublicHeaderProps = {
  back?: boolean
  onShare?: () => void
  title?: string
}

export function PublicHeader({ back = false, onShare }: PublicHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-stone-200 bg-cream-50/95 px-4 py-3 backdrop-blur min-[700px]:-mx-6 min-[700px]:px-6">
      <div className="grid min-h-28 grid-cols-[48px_1fr_48px] items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`grid h-11 w-11 place-items-center rounded-md text-stone-700 ${back ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-label="Torna indietro"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex flex-col items-center">
          <Logo compact />
        </div>
        <button
          type="button"
          onClick={onShare}
          className={`grid h-11 w-11 place-items-center rounded-md text-stone-700 ${onShare ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-label="Condividi"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
