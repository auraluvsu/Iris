import { useState, useMemo, useRef } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, Link, Layers, Palette } from 'lucide-react'
import CardModal from '../components/CardModal'
import BackdropPicker, { BACKDROPS } from '../components/BackdropPicker'

const STATUS_META = {
  urgent:   { label: 'Urgent',   color: 'var(--urgent)',   bg: 'var(--urgent-bg)'   },
  pressing: { label: 'Pressing', color: 'var(--pressing)', bg: 'var(--pressing-bg)' },
  lenient:  { label: 'Lenient',  color: 'var(--lenient)',  bg: 'var(--lenient-bg)'  },
}

const STAGE_META = {
  todo:       { label: 'Yet to Start', accent: 'var(--faint)'    },
  inprogress: { label: 'Working On',   accent: 'var(--jade)'     },
  done:       { label: 'Done',         accent: 'var(--jade-dark)' },
}
const STAGES = ['todo', 'inprogress', 'done']

const SEED = [
  { id: '1', title: 'Set up Vercel deployment', desc: 'Configure env vars and domain', status: 'urgent',   stage: 'inprogress', subcards: [], links: [] },
  { id: '2', title: 'Style landing page',        desc: '',                              status: 'pressing', stage: 'todo',       subcards: [], links: [] },
  { id: '3', title: 'Write README',              desc: '',                              status: 'lenient',  stage: 'todo',       subcards: [], links: [] },
  { id: '4', title: 'Initial scaffold',          desc: 'React + Vite done',             status: 'lenient',  stage: 'done',       subcards: [], links: [] },
]

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export default function TasksPage() {
  const [cards,      setCards]      = useState(() => load('cards', SEED))
  const [modal,      setModal]      = useState(null)
  const [backdropId, setBackdropId] = useState(() => load('backdropId', 'default'))
  const [showBdrop,  setShowBdrop]  = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  // track which card just landed in done for the flash animation
  const [doneFlash,  setDoneFlash]  = useState(null)
  // track prev stage so we only flash on transition INTO done
  const prevStageRef = useRef({})

  const persist = (updated) => { setCards(updated); localStorage.setItem('cards', JSON.stringify(updated)) }
  const persistBd = (id)    => { setBackdropId(id);  localStorage.setItem('backdropId', JSON.stringify(id)) }

  const saveCard = (card) => {
    const exists = cards.find(c => c.id === card.id)
    persist(exists ? cards.map(c => c.id === card.id ? card : c) : [...cards, card])
  }

  const deleteCard = (id) => { if (confirm('Delete this card?')) persist(cards.filter(c => c.id !== id)) }

  const backdrop = BACKDROPS.find(b => b.id === backdropId) || BACKDROPS[0]

  // ── DnD ──────────────────────────────────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const cardsByStage = useMemo(() => {
    const m = {}
    STAGES.forEach(s => { m[s] = cards.filter(c => c.stage === s) })
    return m
  }, [cards])

  const handleDragStart = ({ active }) => {
    const card = cards.find(c => c.id === active.id)
    setActiveCard(card || null)
    if (card) prevStageRef.current[card.id] = card.stage
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null)
    if (!over) return
    const activeId = active.id
    const overId   = over.id
    if (activeId === overId) return

    const card = cards.find(c => c.id === activeId)
    if (!card) return

    const targetStage = STAGES.includes(overId)
      ? overId
      : (cards.find(c => c.id === overId)?.stage ?? card.stage)

    let updated = cards.map(c => c.id === activeId ? { ...c, stage: targetStage } : c)

    if (!STAGES.includes(overId)) {
      const stageCards = updated.filter(c => c.stage === targetStage)
      const otherCards = updated.filter(c => c.stage !== targetStage)
      const fromIdx    = stageCards.findIndex(c => c.id === activeId)
      const toIdx      = stageCards.findIndex(c => c.id === overId)
      if (fromIdx !== -1 && toIdx !== -1) {
        const reordered = arrayMove(stageCards, fromIdx, toIdx)
        updated = [...otherCards, ...reordered]
      }
    }

    persist(updated)

    // flash animation when newly dropped into done
    if (targetStage === 'done' && prevStageRef.current[activeId] !== 'done') {
      setDoneFlash(activeId)
      setTimeout(() => setDoneFlash(null), 800)
    }
  }

  return (
    <div style={{ ...s.page, ...backdrop.style }}>
      <style>{`
        @keyframes doneFlash {
          0%   { box-shadow: 0 0 0 0 rgba(61,170,122,0); background: var(--elevated); }
          25%  { box-shadow: 0 0 0 6px rgba(61,170,122,0.35); background: rgba(61,170,122,0.18); }
          70%  { box-shadow: 0 0 0 10px rgba(61,170,122,0); }
          100% { box-shadow: 0 0 0 0 rgba(61,170,122,0); background: var(--elevated); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .done-flash { animation: doneFlash 0.75s ease forwards; }
        .card-enter { animation: cardIn 0.2s ease forwards; }
      `}</style>

      {/* Top row */}
      <div style={s.topRow}>
        <div style={s.titleArea}>
          <h1 style={s.pageTitle}>Cards</h1>
          <span style={s.count}>{cards.filter(c => c.stage !== 'done').length} active</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.iconBarBtn} onClick={() => setShowBdrop(true)}>
            <Palette size={14}/> Backdrop
          </button>
          <button style={s.addBtn} onClick={() => setModal({})}>
            <Plus size={14}/> New card
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={s.legend}>
        {Object.entries(STATUS_META).map(([k, v]) => (
          <div key={k} style={s.legendItem}>
            <span style={{ ...s.legendDot, background: v.color }}/>
            <span style={s.legendLabel}>{v.label}</span>
          </div>
        ))}
        <div style={s.legendDivider}/>
        {Object.entries(STAGE_META).map(([k, v]) => (
          <div key={k} style={s.legendItem}>
            <span style={{ ...s.legendBar, background: v.accent }}/>
            <span style={s.legendLabel}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={s.board}>
          {STAGES.map(stage => (
            <Column key={stage} stage={stage} cards={cardsByStage[stage] || []}
              doneFlash={doneFlash}
              onAdd={() => setModal({ card: { stage } })}
              onEdit={card => setModal({ card })}
              onDelete={deleteCard}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeCard && <CardChip card={activeCard} overlay />}
        </DragOverlay>
      </DndContext>

      {modal !== null && (
        <CardModal card={modal.card} onSave={saveCard} onClose={() => setModal(null)} />
      )}
      {showBdrop && (
        <BackdropPicker current={backdropId} onChange={persistBd} onClose={() => setShowBdrop(false)} />
      )}
    </div>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────
function Column({ stage, cards, doneFlash, onAdd, onEdit, onDelete }) {
  const meta = STAGE_META[stage]
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const cardIds = cards.map(c => c.id)

  return (
    <div style={{
      ...s.column,
      outline: isOver ? '1px solid var(--jade)' : '1px solid transparent',
      transition: 'outline 0.1s',
    }}>
      <div style={{ ...s.colHeader, borderTopColor: meta.accent }}>
        <span style={s.colTitle}>{meta.label}</span>
        <span style={s.colCount}>{cards.length}</span>
      </div>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={s.cardList}>
          {cards.map(card => (
            <SortableCard
              key={card.id} card={card}
              flashing={doneFlash === card.id}
              onEdit={onEdit} onDelete={onDelete}
            />
          ))}
          <button style={s.inlineAdd} onClick={onAdd}>
            <Plus size={12}/> Add card
          </button>
        </div>
      </SortableContext>
    </div>
  )
}

// ── SortableCard ──────────────────────────────────────────────────────────────
function SortableCard({ card, flashing, onEdit, onDelete }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CardChip
        card={card} flashing={flashing}
        onEdit={onEdit} onDelete={onDelete}
        dragListeners={listeners} dragAttributes={attributes}
      />
    </div>
  )
}

// ── CardChip ──────────────────────────────────────────────────────────────────
function CardChip({ card, flashing, onEdit, onDelete, dragListeners, dragAttributes, overlay }) {
  const [hover,     setHover]     = useState(false)
  // distinguish a click from a drag: track mousedown position
  const pointerDown = useRef(null)

  const sm            = STATUS_META[card.status] || STATUS_META.lenient
  const doneSubcards  = (card.subcards || []).filter(s => s.done).length
  const totalSubcards = (card.subcards || []).length

  const handlePointerDown = (e) => {
    pointerDown.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e) => {
    if (!onEdit || overlay) return
    const dx = Math.abs(e.clientX - (pointerDown.current?.x ?? e.clientX))
    const dy = Math.abs(e.clientY - (pointerDown.current?.y ?? e.clientY))
    // only open modal if pointer barely moved (i.e. it's a click not a drag)
    if (dx < 5 && dy < 5) onEdit(card)
  }

  return (
    <div
      className={flashing ? 'done-flash card-enter' : ''}
      style={{
        ...s.card,
        borderLeftColor: sm.color,
        boxShadow: overlay ? '0 10px 28px rgba(0,0,0,0.55)' : hover ? '0 2px 10px rgba(0,0,0,0.28)' : 'none',
        cursor: overlay ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...dragListeners}
      {...dragAttributes}
    >
      <div style={s.cardTop}>
        <span style={{ ...s.badge, background: sm.bg, color: sm.color }}>{sm.label}</span>
        {hover && !overlay && (
          <button
            style={{ ...s.iconBtn, color: 'var(--urgent)' }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete(card.id) }}
          >
            <Trash2 size={11}/>
          </button>
        )}
      </div>

      <p style={s.cardTitle}>{card.title}</p>
      {card.desc && <p style={s.cardDesc}>{card.desc}</p>}

      {totalSubcards > 0 && (
        <div style={s.metaRow}>
          <Layers size={10} color="var(--muted)"/>
          <span style={s.metaText}>{doneSubcards}/{totalSubcards}</span>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${(doneSubcards / totalSubcards) * 100}%` }}/>
          </div>
        </div>
      )}

      {(card.links || []).length > 0 && (
        <div style={s.metaRow}>
          <Link size={10} color="var(--muted)"/>
          <span style={s.metaText}>{card.links.length} link{card.links.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}

const s = {
  page:         { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 52px)', overflow: 'auto', backgroundAttachment: 'fixed' },
  topRow:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titleArea:    { display: 'flex', alignItems: 'baseline', gap: 12 },
  pageTitle:    { fontSize: 20, fontWeight: 600, color: 'var(--text)' },
  count:        { fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' },
  addBtn:       { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--jade)', color: '#0D1A13', border: 'none', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", cursor: 'pointer' },
  iconBarBtn:   { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px', fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: 'pointer' },
  legend:       { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 16px' },
  legendItem:   { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot:    { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  legendBar:    { width: 12, height: 3, borderRadius: 2, flexShrink: 0 },
  legendLabel:  { fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' },
  legendDivider:{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' },
  board:        { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, minHeight: 0 },
  column:       { background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  colHeader:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderTop: '2px solid', borderBottom: '1px solid var(--border)' },
  colTitle:     { fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text)', letterSpacing: '0.07em', textTransform: 'uppercase' },
  colCount:     { fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' },
  cardList:     { padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1, minHeight: 60 },
  card:         { background: 'var(--elevated)', border: '1px solid var(--border)', borderLeft: '3px solid', borderRadius: 'var(--radius)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, transition: 'box-shadow 0.15s' },
  cardTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 22 },
  badge:        { fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 10 },
  cardTitle:    { fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 },
  cardDesc:     { fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 },
  iconBtn:      { background: 'none', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: 3, borderRadius: 3, cursor: 'pointer' },
  metaRow:      { display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 },
  metaText:     { fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' },
  progressTrack:{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', maxWidth: 60 },
  progressFill: { height: '100%', background: 'var(--jade)', borderRadius: 2, transition: 'width 0.2s' },
  inlineAdd:    { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', color: 'var(--faint)', padding: '7px', fontSize: 12, fontFamily: "'DM Mono', monospace", width: '100%', cursor: 'pointer' },
}
