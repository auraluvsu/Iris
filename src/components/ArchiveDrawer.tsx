import { useState, CSSProperties } from 'react'
import { X, RotateCcw, Trash2, Archive } from 'lucide-react'
import { getDueState, formatDue } from '../utils/dueDate'

interface Card {
  id: string
  title: string
  desc: string
  status: 'urgent' | 'pressing' | 'lenient'
  stage: 'todo' | 'inprogress' | 'done'
  dueDate: string
  archivedAt?: string
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

interface ArchiveDrawerProps {
  archived: Card[]
  onRestore: (id: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export default function ArchiveDrawer({ archived, onRestore, onDelete, onClose }: ArchiveDrawerProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null)

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 80 }}
        onClick={onClose}
      />

      <div style={s.drawer} className="drawer-enter">
        <div style={s.header}>
          <div style={s.headerLeft}>
            <Archive size={15} color="var(--jade)" />
            <span style={s.heading}>Archive</span>
            <span style={s.count}>{archived.length}</span>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={15} /></button>
        </div>

        {archived.length === 0 ? (
          <div style={s.empty}>
            <Archive size={28} color="var(--faint)" />
            <p style={s.emptyText}>No archived cards yet.<br />Cards you archive will appear here.</p>
          </div>
        ) : (
          <div style={s.list}>
            {archived.map(card => {
              const sm = STATUS_META[card.status] || STATUS_META.lenient
              const due = getDueState(card.dueDate)

              return (
                <div key={card.id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.cardMeta}>
                      <span style={{ ...s.badge, color: sm.color }}>{sm.label}</span>
                      {card.dueDate && (
                        <span style={{ ...s.duePill, color: due.color }}>
                          {formatDue(card.dueDate)}
                        </span>
                      )}
                    </div>
                    <div style={s.actions}>
                      <button
                        style={{ ...s.actionBtn, color: 'var(--jade)' }}
                        onClick={() => onRestore(card.id)}
                        title="Restore card"
                      >
                        <RotateCcw size={12} />
                      </button>
                      {confirmId === card.id ? (
                        <>
                          <button
                            style={{ ...s.actionBtn, color: 'var(--urgent)', fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                            onClick={() => { onDelete(card.id); setConfirmId(null) }}
                          >
                            Confirm
                          </button>
                          <button
                            style={{ ...s.actionBtn, color: 'var(--muted)', fontSize: 10, fontFamily: "'DM Mono', monospace" }}
                            onClick={() => setConfirmId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          style={{ ...s.actionBtn, color: 'var(--urgent)' }}
                          onClick={() => setConfirmId(card.id)}
                          title="Delete permanently"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={s.title}>{card.title}</p>
                  {card.desc && <p style={s.desc}>{card.desc}</p>}

                  <div style={s.cardFooter}>
                    <span style={s.stagePill}>{card.stage === 'todo' ? 'Yet to Start' : card.stage === 'inprogress' ? 'Working On' : 'Done'}</span>
                    {card.archivedAt && (
                      <span style={s.archivedAt}>
                        Archived {new Date(card.archivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
        .drawer-enter { animation: drawerIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>
    </>
  )
}

const s: Record<string, CSSProperties> = {
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, maxWidth: '92vw', background: 'var(--surface)', borderLeft: '1px solid var(--border)', zIndex: 90, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 9 },
  heading: { fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)', letterSpacing: '0.04em' },
  count: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '1px 7px' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4, cursor: 'pointer' },
  list: { overflowY: 'auto', flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 },
  card: { background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: { fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' },
  duePill: { fontFamily: "'DM Mono', monospace", fontSize: 10 },
  actions: { display: 'flex', alignItems: 'center', gap: 4 },
  actionBtn: { background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 3, cursor: 'pointer' },
  title: { fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 },
  desc: { fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  stagePill: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--faint)', letterSpacing: '0.04em' },
  archivedAt: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--faint)' },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  emptyText: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7 },
}
