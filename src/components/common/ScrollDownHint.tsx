import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollDownHint() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function updateVisibility() {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 80
      setVisible(scrollable)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [location.pathname])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Scorri verso il basso"
      onClick={() => window.scrollBy({ top: Math.round(window.innerHeight * 0.72), behavior: 'smooth' })}
      className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom))] left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-wine-700/25 bg-[#f6f2e8]/95 text-wine-700 shadow-soft backdrop-blur"
    >
      <ChevronDown className="h-7 w-7 animate-bounce" strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}
