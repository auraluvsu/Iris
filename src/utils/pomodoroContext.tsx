import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode, Context } from 'react'

const WORK_SECS = 25 * 60
const BREAK_SECS = 5 * 60

interface Sessions {
  [cardId: string]: number
}

interface PomodoroContextType {
  cardId: string | null
  cardTitle: string
  phase: 'work' | 'break'
  remaining: number
  running: boolean
  sessions: Sessions
  floating: boolean
  start: (id: string, title: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  detach: () => void
  attach: () => void
  fmt: (secs: number) => string
  WORK_SECS: number
  BREAK_SECS: number
}

const Ctx = createContext<PomodoroContextType | null>(null) as Context<PomodoroContextType | null>

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [cardId, setCardId] = useState<string | null>(null)
  const [cardTitle, setCardTitle] = useState('')
  const [phase, setPhase] = useState<'work' | 'break'>('work')
  const [remaining, setRemaining] = useState(WORK_SECS)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState<Sessions>({})
  const [floating, setFloating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const tick = useCallback(() => {
    setRemaining(r => {
      if (r <= 1) {
        setPhase(p => {
          if (p === 'work') {
            setCardId(id => {
              if (id) setSessions(s => ({ ...s, [id]: (s[id] || 0) + 1 }))
              return id
            })
            setRemaining(BREAK_SECS)
            return 'break'
          } else {
            setRemaining(WORK_SECS)
            return 'work'
          }
        })
        return r
      }
      return r - 1
    })
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current ?? undefined)
    }
    return () => clearInterval(intervalRef.current ?? undefined)
  }, [running, tick])

  const start = (id: string, title: string): void => {
    setCardId(id)
    setCardTitle(title)
    setPhase('work')
    setRemaining(WORK_SECS)
    setRunning(true)
    setFloating(false)
  }

  const pause = (): void => setRunning(false)
  const resume = (): void => setRunning(true)
  const stop = (): void => {
    setRunning(false)
    setCardId(null)
    setCardTitle('')
    setPhase('work')
    setRemaining(WORK_SECS)
    setFloating(false)
  }
  const detach = (): void => setFloating(true)
  const attach = (): void => setFloating(false)

  const fmt = (secs: number): string => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`

  const value: PomodoroContextType = { cardId, cardTitle, phase, remaining, running, sessions, floating, start, pause, resume, stop, detach, attach, fmt, WORK_SECS, BREAK_SECS }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePomodoro = (): PomodoroContextType => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider')
  return ctx
}
