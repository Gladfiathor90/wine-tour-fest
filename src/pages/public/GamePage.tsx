import { Play, RotateCcw, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PublicHeader } from '../../components/common/PublicHeader'
import { usePageMeta } from '../../hooks/usePageMeta'
import { contentService } from '../../services/contentService'

type GameState = 'intro' | 'playing' | 'paused' | 'ended'
type FallingItem = {
  id: number
  kind: 'glass' | 'grape' | 'cheese' | 'brokenBottle'
  x: number
  y: number
  speed: number
}
type CatchEffect = {
  id: number
  x: number
  y: number
  label: string
}

const icons = {
  glass: '🍷',
  grape: '🍇',
  cheese: '🧀',
}

function renderFallingItem(kind: FallingItem['kind']) {
  if (kind === 'brokenBottle') {
    return (
      <span className="game-bomb" aria-label="Bomba">
        <span className="game-bomb-fuse" />
        <span className="game-bomb-spark" />
      </span>
    )
  }

  return icons[kind]
}

const prizeKey = 'wtf-prize-code'
const recordKey = 'wtf-game-record'
const levelBackgrounds = [
  'linear-gradient(180deg, #f4efe3 0%, #fffaf0 100%)',
  'linear-gradient(180deg, #f1decf 0%, #f7efe1 100%)',
  'linear-gradient(180deg, #e5b9ad 0%, #f4efe3 100%)',
  'linear-gradient(180deg, #c86962 0%, #f1decf 100%)',
  'linear-gradient(180deg, #8f1618 0%, #dca9a0 100%)',
  'linear-gradient(180deg, #4c0809 0%, #a11616 100%)',
]

function createPrizeCode() {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X')
  return `WTF26-${segment()}-${segment()}`
}

export function GamePage() {
  const settings = contentService.gameSettings.demo()
  const [state, setState] = useState<GameState>('intro')
  const [score, setScore] = useState(0)
  const [catchCount, setCatchCount] = useState(0)
  const [lives, setLives] = useState(settings.lives)
  const [timeLeft, setTimeLeft] = useState(settings.duration)
  const [basketX, setBasketX] = useState(50)
  const [items, setItems] = useState<FallingItem[]>([])
  const [catchEffects, setCatchEffects] = useState<CatchEffect[]>([])
  const [scorePulse, setScorePulse] = useState(false)
  const [record, setRecord] = useState(() => Number(localStorage.getItem(recordKey) ?? 0))
  const [prizeCode, setPrizeCode] = useState(() => localStorage.getItem(prizeKey) ?? '')
  const [resultDate, setResultDate] = useState('')
  const areaRef = useRef<HTMLDivElement>(null)
  const itemId = useRef(0)
  usePageMeta('Gioca', 'Mini gioco promozionale Acchiappa il Calice.')

  const hasPrize = score >= settings.prizeThreshold
  const speedLevel = Math.floor(catchCount / 8)
  const levelBackground = levelBackgrounds[Math.min(speedLevel, levelBackgrounds.length - 1)]

  function resetGame() {
    setScore(0)
    setCatchCount(0)
    setLives(settings.lives)
    setTimeLeft(settings.duration)
    setItems([])
    setCatchEffects([])
    setBasketX(50)
    setState('playing')
  }

  const endGame = useCallback((finalScore = score) => {
    setState('ended')
    setResultDate(new Date().toLocaleString('it-IT'))
    if (finalScore > record) {
      setRecord(finalScore)
      localStorage.setItem(recordKey, String(finalScore))
    }
    if (finalScore >= settings.prizeThreshold && !prizeCode) {
      const code = createPrizeCode()
      setPrizeCode(code)
      localStorage.setItem(prizeKey, code)
    }
  }, [prizeCode, record, score, settings.prizeThreshold])

  useEffect(() => {
    if (state !== 'playing') return
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          endGame(score)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [endGame, score, state])

  useEffect(() => {
    if (!score) return
    setScorePulse(true)
    const timeout = window.setTimeout(() => setScorePulse(false), 280)
    return () => window.clearTimeout(timeout)
  }, [score])

  useEffect(() => {
    if (state !== 'playing') return
    const spawn = window.setInterval(() => {
      const kinds: FallingItem['kind'][] = ['glass', 'glass', 'grape', 'cheese', 'brokenBottle']
      const kind = kinds[Math.floor(Math.random() * kinds.length)]
      const baseSpeed = Math.max(0.72, settings.gameSpeed * 0.42)
      setItems((current) => [
        ...current,
        { id: itemId.current++, kind, x: 8 + Math.random() * 84, y: -8, speed: baseSpeed + speedLevel * 0.2 + Math.random() * 0.58 },
      ])
    }, Math.max(520, 940 - speedLevel * 45))
    return () => window.clearInterval(spawn)
  }, [settings.gameSpeed, speedLevel, state])

  useEffect(() => {
    if (state !== 'playing') return
    let frame = 0
    const tick = () => {
      setItems((current) => {
        const next: FallingItem[] = []
        let scoreDelta = 0
        let caughtItems = 0
        let lostLives = 0
        current.forEach((item) => {
          const nextY = item.y + item.speed
          const caught = nextY > 80 && nextY < 98 && Math.abs(item.x - basketX) < 12
          if (caught) {
            if (item.kind === 'brokenBottle') lostLives += 1
            else {
              const points = settings.itemScores[item.kind]
              scoreDelta += points
              caughtItems += 1
              const effectId = itemId.current++
              setCatchEffects((effects) => [...effects, { id: effectId, x: item.x, y: Math.min(nextY, 86), label: `+${points}` }])
              window.setTimeout(() => {
                setCatchEffects((effects) => effects.filter((effect) => effect.id !== effectId))
              }, 650)
            }
          } else if (nextY > 104) {
            if (item.kind !== 'brokenBottle') lostLives += 1
          } else {
            next.push({ ...item, y: nextY })
          }
        })
        if (scoreDelta) setScore((value) => value + scoreDelta)
        if (caughtItems) setCatchCount((value) => value + caughtItems)
        if (lostLives) {
          setLives((value) => {
            const nextLives = value - lostLives
            if (nextLives <= 0) window.setTimeout(() => endGame(score + scoreDelta), 0)
            return Math.max(0, nextLives)
          })
        }
        return next
      })
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [basketX, endGame, score, settings.itemScores, state])

  function moveBasket(clientX: number) {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((clientX - rect.left) / rect.width) * 100
    setBasketX(Math.max(8, Math.min(92, x)))
  }

  return (
    <div className="space-y-3">
      <PublicHeader back title="Gioca" />
      <section className="rounded-lg bg-wine-700 p-3 text-cream-50 shadow-sm">
        <h1 className="text-2xl font-bold">Acchiappa il Calice</h1>
        <p className="mt-2 rounded-md bg-cream-50/10 px-3 py-2 text-sm">Soglia premio: {settings.prizeThreshold} punti · Record: {record}</p>
      </section>

      <section
        ref={areaRef}
        onPointerMove={(event) => moveBasket(event.clientX)}
        onPointerDown={(event) => moveBasket(event.clientX)}
        className="relative h-[56svh] min-h-[440px] max-h-[640px] touch-none overflow-hidden rounded-lg border border-stone-200 shadow-sm transition-colors duration-700"
        style={{ background: levelBackground }}
      >
        <div className="absolute left-0 top-0 z-10 grid w-full grid-cols-4 gap-1 bg-white/80 p-3 text-center text-xs font-semibold backdrop-blur">
          <span className={scorePulse ? 'score-bump' : ''}>Punti {score}</span>
          <span>Prese {catchCount}</span>
          <span>Liv. {speedLevel + 1}</span>
          <span>Vite {lives}</span>
        </div>
        <div className="absolute right-3 top-14 z-10 rounded-md bg-cream-50/85 px-2 py-1 text-xs font-bold text-wine-700 shadow-sm">{timeLeft}s</div>
        {items.map((item) => (
          <div key={item.id} className={`falling-item falling-item-${item.kind} absolute text-[2.55rem] leading-none drop-shadow-md`} style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}>
            {renderFallingItem(item.kind)}
          </div>
        ))}
        {catchEffects.map((effect) => (
          <div key={effect.id} className="catch-pop absolute z-20 rounded-full bg-cream-50 px-3 py-1 text-lg font-black text-wine-700 shadow-soft" style={{ left: `${effect.x}%`, top: `${effect.y}%`, transform: 'translate(-50%, -50%)' }}>
            {effect.label}
          </div>
        ))}
        <div className="wine-glass-loop absolute bottom-9" style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }} aria-label="Calice di vino">
          <span className="wine-bowl"><span className="wine-fill" /></span>
          <span className="wine-stem" />
        </div>
        {state === 'intro' ? <div className="absolute inset-x-5 top-20 rounded-lg bg-cream-50/85 p-4 text-center text-sm font-semibold text-wine-700 shadow-soft">Tocca in basso e trascina il calice per prendere gli elementi.</div> : null}
        {state === 'paused' ? <div className="absolute inset-0 grid place-items-center bg-white/75 text-2xl font-bold text-stone-950">Pausa</div> : null}
        {state === 'ended' ? (
          <div className="absolute inset-0 grid place-items-center bg-white/95 p-5 text-center">
            <div>
              <Trophy className="mx-auto h-10 w-10 text-gold-700" aria-hidden="true" />
              <h2 className="mt-3 text-3xl font-bold text-stone-950">Partita finita</h2>
              <p className="mt-2 text-lg font-semibold text-wine-700">{score} punti</p>
              <p className="mt-1 text-sm text-stone-600">{resultDate}</p>
              {hasPrize ? (
                <div className="mt-4 rounded-lg bg-gold-100 p-4 text-stone-950">
                  <p className="font-bold">{settings.prizeText}</p>
                  <p className="mt-1 text-sm">{settings.finalMessage}</p>
                  <p className="mt-3 font-mono text-lg font-bold">{prizeCode || localStorage.getItem(prizeKey)}</p>
                </div>
              ) : <p className="mt-4 text-sm text-stone-600">Soglia non raggiunta. Riprova!</p>}
              <button type="button" onClick={resetGame} className="mt-5 min-h-12 rounded-md bg-wine-700 px-5 text-sm font-semibold text-white">Rigioca</button>
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={resetGame} className="game-control-button wtf-button-primary inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-wine-700 px-3 text-base font-semibold text-white">
          <Play className="h-4 w-4 shrink-0" />
          <span>Inizia partita</span>
        </button>
        <button type="button" onClick={resetGame} className="game-control-button wtf-button-secondary inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md border border-wine-700 bg-cream-100 px-3 text-base font-semibold text-wine-700">
          <RotateCcw className="h-4 w-4 shrink-0" />
          <span>Rigioca</span>
        </button>
      </div>
    </div>
  )
}
