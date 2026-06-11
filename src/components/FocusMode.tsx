import { useState, useEffect, CSSProperties } from 'react'
import { X, Plus, CheckCircle2, Circle, Timer, ChevronDown } from 'lucide-react'
import { getDueState, formatDue } from '../utils/dueDate'
import { usePomodoro } from '../utils/pomodoroContext'

interface Card {
  id: string
  title: string
  desc: string
  status: 'urgent' | 'pressing' | 'lenient'
  stage: 'todo' | 'inprogress' | 'done'
  subcards: Array<{ id: string; title: string; text?: string; done: boolean }>
  links: Array<{ id: string; url: string; title: string }>
  dueDate: string
}

interface StatusMeta {
  label: string
  color: string
}

const STATUS_META: Record<string, StatusMeta> = {
  urgent: { label: 'Urgent', color: 'var(--urgent)' },
  pressing: { label: 'Pressing', color: 'var(--pressing)' },
  lenient: { label: 'Lenient', color: 'var(--lenient)' },
}

const MAX_CARDS = 3

interface FocusModeProps {
  cards: Card[]
  onClose: () => void
  onCardDone: (id: string) => void
}

export default function FocusMode({ cards, onClose, onCardDone }: FocusModeProps) {
  const pom = usePomodoro()

  const todayKey = `focus-${new Date().toISOString().slice(0, 10)}`
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(todayKey))
      if (Array.isArray(saved)) return saved.filter(id => cards.find(c => c.id === id))
    } catch {}
    return []
  })
  const [picking, setPicking] = useState(selectedIds.length === 0)
  const [completedIds, setCompleted] = useState<string[]>(() =>
    selectedIds.filter(id => {
      const card = cards.find(c => c.id === id)
      return card?.stage === 'done'
    })
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 20))
  }, [])

  useEffect(() => {
    localStorage.setItem(todayKey, JSON.stringify(selectedIds))
  }, [selectedIds, todayKey])

  const focusCards = selectedIds.map(id => cards.find(c => c.id === id)).filter((c): c is Card => !!c)

  const togglePick = (id: string): void => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < MAX_CARDS ? [...prev, id] : prev
    )
  }

  const markDone = (id: string): void => {
    setCompleted(prev => [...prev, id])
    onCardDone(id)
  }

  const allDone = focusCards.length > 0 && focusCards.every(c => completedIds.includes(c.id))

  const handleClose = (): void => {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  return (
    <div style={{
      ...s.overlay,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'scale(0.98)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    }}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.logo}><span style={{ color: 'var(--jade)' }}>◈</span> focus</span>
          <span style={s.date}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
        <button style={s.closeBtn} onClick={handleClose}><X size={16} /></button>
      </div>

      <div style={s.body}>
        {allDone ? (
          <div style={s.allDoneWrap}>
            <div style={s.allDoneIcon}>◈</div>
            <h2 style={s.allDoneTitle}>All done for today.</h2>
            <p style={s.allDoneSubtitle}>Good work. Come back tomorrow.</p>
            <button style={s.closeDoneBtn} onClick={handleClose}>Close focus mode</button>
          </div>
        ) : (
          <>
            <div style={s.titleRow}>
              <h1 style={s.title}>Today's focus</h1>
              <span style={s.subtitle}>
                {focusCards.length === 0 ? 'Pick up to 3 cards to work on today' : `${focusCards.length - completedIds.filter(id => focusCards.find(c => c.id === id)).length} remaining`}
              </span>
            </div>

            {focusCards.length > 0 && (
              <div style={s.focusList}>
                {focusCards.map(card => {
                  const done = completedIds.includes(card.id)
                  const sm = STATUS_META[card.status] || STATUS_META.lenient
                  const due = getDueState(card.dueDate)
                  const isTimer = pom.cardId === card.id
                  const progress = isTimer
                    ? 1 - pom.remaining / (pom.phase === 'work' ? pom.WORK_SECS : pom.BREAK_SECS)
                    : 0
                  const circ = 2 * Math.PI * 10

                  return (
                    <div key={card.id} style={{ ...s.focusCard, opacity: done ? 0.45 : 1, borderLeftColor: sm.color }}>
                      <button
                        style={s.doneBtn}
                        onClick={() => !done && markDone(card.id)}
                        disabled={done}
                      >
                        {done
                          ? <CheckCircle2 size={22} color="var(--jade)" fill="var(--jade-glow)" />
                          : <Circle size={22} color="var(--faint)" />
                        }
                      </button>

                      <div style={s.cardBody}>
                        <div style={s.cardTopRow}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: sm.color }}>{sm.label}</span>
                          {card.dueDate && (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: due.color }}>
                              {formatDue(card.dueDate)} · {due.label}
                            </span>
                          )}
                        </div>
                        <p style={{ ...s.cardTitle, textDecoration: done ? 'line-through' : 'none' }}>{card.title}</p>
                        {card.desc && <p style={s.cardDesc}>{card.desc}</p>}

                        {(card.subcards || []).length > 0 && (
                          <div style={s.subList}>
                            {card.subcards.map(sub => (
                              <div key={sub.id} style={s.subItem}>
                                <span style={{ color: sub.done ? 'var(--jade)' : 'var(--faint)', fontSize: 12 }}>
                                  {sub.done ? '✓' : '○'}
                                </span>
                                <span style={{ fontSize: 12, color: sub.done ? 'var(--muted)' : 'var(--text)', textDecoration: sub.done ? 'line-through' : 'none' }}>
                                  {sub.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {!done && (
                        <div style={s.pomSection}>
                          {isTimer ? (
                            <div style={s.pomActive}>
                              <svg width="28" height="28" viewBox="0 0 28 28">
                                <circle cx="14" cy="14" r="10" fill="none" stroke="var(--border)" strokeWidth="2" />
                                <circle cx="14" cy="14" r="10" fill="none"
                                  stroke={pom.phase === 'break' ? 'var(--pressing)' : 'var(--jade)'}
                                  strokeWidth="2"
                                  strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
                                  strokeLinecap="round" transform="rotate(-90 14 14)"
                                  style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                                />
                              </svg>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: pom.phase === 'break' ? 'var(--pressing)' : 'var(--jade)' }}>
                                {pom.fmt(pom.remaining)}
                              </span>
                              <button style={s.pomBtn} onClick={pom.running ? pom.pause : pom.resume}>
                                {pom.running ? '⏸' : '▶'}
                              </button>
                              <button style={{ ...s.pomBtn, color: 'var(--urgent)' }} onClick={pom.stop}>■</button>
                            </div>
                          ) : (
                            <button style={s.pomStartBtn} onClick={() => pom.start(card.id, card.title)}>
                              <Timer size={12} /> Focus
                            </button>
                          )}
                          <span style={s.sessions}>{pom.sessions[card.id] || 0}🍅</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div style={s.pickerSection}>
              <button style={s.pickerToggle} onClick={() => setPicking(p => !p)}>
                <Plus size={13} />
                {focusCards.length === 0 ? 'Select cards to focus on' : 'Manage cards'}
                <ChevronDown size={12} style={{ marginLeft: 'auto', transform: picking ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {picking && (
                <div style={s.pickerList}>
                  {cards.filter(c => c.stage !== 'done').length === 0 ? (
                    <p style={s.noCards}>No active cards available.</p>
                  ) : (
                    cards.filter(c => c.stage !== 'done').map(card => {
                      const sm = STATUS_META[card.status] || STATUS_META.lenient
                      const selected = selectedIds.includes(card.id)
                      const atMax = selectedIds.length >= MAX_CARDS && !selected
                      return (
                        <button
                          key={card.id}
                          onClick={() => !atMax && togglePick(card.id)}
                          style={{
                            ...s.pickItem,
                            borderColor: selected ? 'var(--jade)' : 'var(--border)',
                            background: selected ? 'var(--jade-glow)' : 'var(--elevated)',
                            opacity: atMax ? 0.4 : 1,
                            cursor: atMax ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <span style={{ ...s.pickDot, background: sm.color }} />
                          <span style={s.pickTitle}>{card.title}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: selected ? 'var(--urgent)' : 'var(--faint)' }}>
                            {selected ? '✕ remove' : atMax ? 'full' : '+ add'}
                          </span>
                        </button>
                      )
                    })
                  )}
                  {selectedIds.length >= MAX_CARDS && (
                    <p style={s.hintText}>Remove a card above to swap it out.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 20 },
  logo: { fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em' },
  date: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--faint)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 4, cursor: 'pointer' },
  body: { flex: 1, overflowY: 'auto', padding: '48px 32px', maxWidth: 680, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 },
  titleRow: { display: 'flex', flexDirection: 'column', gap: 6 },
  title: { fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' },
  subtitle: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' },
  focusList: { display: 'flex', flexDirection: 'column', gap: 12 },
  focusCard: { display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid', borderRadius: 'var(--radius-lg)', padding: '18px 20px', transition: 'opacity 0.3s' },
  doneBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: 5 },
  cardTopRow: { display: 'flex', gap: 12, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, transition: 'all 0.2s' },
  cardDesc: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 },
  subList: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 },
  subItem: { display: 'flex', gap: 8, alignItems: 'center' },
  pomSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 },
  pomActive: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  pomBtn: { background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, padding: 2 },
  pomStartBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'var(--jade-glow)', border: '1px solid var(--jade)', color: 'var(--jade)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: 'pointer' },
  sessions: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' },
  pickerSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  pickerToggle: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--muted)', fontSize: 13, fontFamily: "'DM Mono', monospace", cursor: 'pointer', width: '100%', textAlign: 'left' },
  pickerList: { display: 'flex', flexDirection: 'column', gap: 6 },
  pickItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--elevated)', border: '1px solid', borderRadius: 'var(--radius)', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.12s', textAlign: 'left', width: '100%' },
  pickDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  pickTitle: { flex: 1, fontSize: 13, color: 'var(--text)' },
  noCards: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--faint)', textAlign: 'center', padding: '12px 0' },
  hintText: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--faint)', textAlign: 'center', padding: '4px 0' },
  allDoneWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' },
  allDoneIcon: { fontSize: 48, color: 'var(--jade)' },
  allDoneTitle: { fontSize: 28, fontWeight: 600, color: 'var(--text)' },
  allDoneSubtitle: { fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--muted)' },
  closeDoneBtn: { marginTop: 8, background: 'var(--jade)', color: '#0D1A13', border: 'none', borderRadius: 'var(--radius)', padding: '10px 24px', fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", cursor: 'pointer' },
}
