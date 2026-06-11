import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const WORK_SECS  = 25 * 60
const BREAK_SECS =  5 * 60

const Ctx = createContext(null)

export function PomodoroProvider({ children }) {
  const [cardId,     setCardId]     = useState(null)   // which card is running
  const [cardTitle,  setCardTitle]  = useState('')
  const [phase,      setPhase]      = useState('work') // 'work' | 'break'
  const [remaining,  setRemaining]  = useState(WORK_SECS)
  const [running,    setRunning]    = useState(false)
  const [sessions,   setSessions]   = useState({})     // cardId → count
  const [floating,   setFloating]   = useState(false)  // detached mini-timer
  const intervalRef  = useRef(null)

  const tick = useCallback(() => {
    setRemaining(r => {
      if (r <= 1) {
        // phase complete
        setPhase(p => {
          if (p === 'work') {
            // log a completed session
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
        return r // will be overwritten by setRemaining above, but keeps flow clean
      }
      return r - 1
    })
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, tick])

  const start = (id, title) => {
    setCardId(id)
    setCardTitle(title)
    setPhase('work')
    setRemaining(WORK_SECS)
    setRunning(true)
    setFloating(false)
  }

  const pause  = ()  => setRunning(false)
  const resume = ()  => setRunning(true)
  const stop   = ()  => { setRunning(false); setCardId(null); setCardTitle(''); setPhase('work'); setRemaining(WORK_SECS); setFloating(false) }
  const detach = ()  => setFloating(true)
  const attach = ()  => setFloating(false)

  const fmt = (secs) => `${String(Math.floor(secs / 60)).padStart(2,'0')}:${String(secs % 60).padStart(2,'0')}`

  const value = { cardId, cardTitle, phase, remaining, running, sessions, floating, start, pause, resume, stop, detach, attach, fmt, WORK_SECS, BREAK_SECS }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePomodoro = () => useContext(Ctx)
