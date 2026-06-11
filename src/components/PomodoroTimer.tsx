import { CSSProperties, ReactNode } from 'react'
import { usePomodoro } from '../utils/pomodoroContext'
import { Play, Pause, Square, Maximize2, Minimize2 } from 'lucide-react'

interface PomodoroInlineProps {
  cardId: string
  cardTitle: string
}

export function PomodoroInline({ cardId, cardTitle }: PomodoroInlineProps) {
  const pom = usePomodoro()
  const isThis = pom.cardId === cardId
  const paused = isThis && !pom.running && pom.cardId !== null
  const sessions = pom.sessions[cardId] || 0
  const progress = isThis
    ? 1 - pom.remaining / (pom.phase === 'work' ? pom.WORK_SECS : pom.BREAK_SECS)
    : 0

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <div style={s.ringWrap}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle
              cx="26" cy="26" r="22" fill="none"
              stroke={isThis && pom.phase === 'break' ? 'var(--pressing)' : 'var(--jade)'}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress)}`}
              strokeLinecap="round"
              transform="rotate(-90 26 26)"
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <span style={s.ringLabel}>
            {isThis ? pom.fmt(pom.remaining) : '25:00'}
          </span>
        </div>

        <div style={s.info}>
          <span style={{ ...s.phaseLabel, color: isThis && pom.phase === 'break' ? 'var(--pressing)' : 'var(--jade)' }}>
            {isThis ? (pom.phase === 'work' ? 'Focus' : 'Break') : 'Pomodoro'}
          </span>
          <span style={s.sessionCount}>
            {sessions} session{sessions !== 1 ? 's' : ''} completed
          </span>
          {isThis && pom.floating && (
            <span style={s.floatHint}>Running in background</span>
          )}
        </div>

        <div style={s.controls}>
          {!isThis ? (
            <CtrlBtn color="var(--jade)" onClick={() => pom.start(cardId, cardTitle)}>
              <Play size={13} fill="var(--jade)" />
            </CtrlBtn>
          ) : (
            <>
              {pom.running
                ? <CtrlBtn onClick={pom.pause}><Pause size={13} /></CtrlBtn>
                : <CtrlBtn color="var(--jade)" onClick={pom.resume}><Play size={13} fill="var(--jade)" /></CtrlBtn>
              }
              <CtrlBtn onClick={pom.detach} title="Detach to floating timer">
                <Maximize2 size={12} />
              </CtrlBtn>
              <CtrlBtn color="var(--urgent)" onClick={pom.stop}>
                <Square size={12} fill="var(--urgent)" />
              </CtrlBtn>
            </>
          )}
        </div>
      </div>

      {pom.cardId && pom.cardId !== cardId && (
        <div style={s.otherRunning}>
          <span style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
            Timer running on another card
          </span>
          <button style={s.switchBtn} onClick={() => pom.start(cardId, cardTitle)}>
            Switch here
          </button>
        </div>
      )}
    </div>
  )
}

export function PomodoroFloating() {
  const pom = usePomodoro()
  if (!pom.cardId || !pom.floating) return null

  const progress = 1 - pom.remaining / (pom.phase === 'work' ? pom.WORK_SECS : pom.BREAK_SECS)
  const accent = pom.phase === 'break' ? 'var(--pressing)' : 'var(--jade)'
  const circ = 2 * Math.PI * 14

  return (
    <div style={f.wrap} className="float-enter">
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round" transform="rotate(-90 18 18)"
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>

      <div style={f.info}>
        <span style={{ ...f.time, color: accent }}>{pom.fmt(pom.remaining)}</span>
        <span style={f.title} title={pom.cardTitle}>{pom.cardTitle}</span>
      </div>

      <div style={f.btns}>
        {pom.running
          ? <FBtn onClick={pom.pause}><Pause size={11} /></FBtn>
          : <FBtn onClick={pom.resume}><Play size={11} fill="var(--jade)" /></FBtn>
        }
        <FBtn onClick={pom.attach} title="Return to card"><Minimize2 size={11} /></FBtn>
        <FBtn onClick={pom.stop}><Square size={11} fill="var(--urgent)" /></FBtn>
      </div>

      <style>{`
        @keyframes floatIn {
          from { opacity:0; transform: translateY(12px) scale(0.95); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        .float-enter { animation: floatIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>
    </div>
  )
}

interface CtrlBtnProps {
  onClick: () => void
  color?: string
  title?: string
  children: ReactNode
}

function CtrlBtn({ onClick, color, title, children }: CtrlBtnProps) {
  return (
    <button onClick={onClick} title={title} style={{
      ...s.ctrlBtn, color: color || 'var(--muted)',
    }}>{children}</button>
  )
}

interface FBtnProps {
  onClick: () => void
  title?: string
  children: ReactNode
}

function FBtn({ onClick, title, children }: FBtnProps) {
  return (
    <button onClick={onClick} title={title} style={f.btn}>{children}</button>
  )
}

const s: Record<string, CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 14, background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px' },
  ringWrap: { position: 'relative', width: 52, height: 52, flexShrink: 0 },
  ringLabel: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text)' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 },
  phaseLabel: { fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500 },
  sessionCount: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' },
  floatHint: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--pressing)' },
  controls: { display: 'flex', gap: 4, alignItems: 'center' },
  ctrlBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 4, cursor: 'pointer' },
  otherRunning: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
  switchBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--jade)', borderRadius: 4, padding: '3px 8px', fontSize: 10, fontFamily: "'DM Mono', monospace", cursor: 'pointer' },
}

const f: Record<string, CSSProperties> = {
  wrap: { position: 'fixed', bottom: 24, right: 24, zIndex: 150, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 220 },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  time: { fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500 },
  title: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 },
  btns: { display: 'flex', gap: 2 },
  btn: { background: 'none', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: 5, borderRadius: 4, cursor: 'pointer' },
}
