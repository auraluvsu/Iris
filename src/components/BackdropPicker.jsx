import { X, Check } from 'lucide-react'

export const BACKDROPS = [
  {
    id: 'default',
    label: 'Default',
    style: { background: 'var(--bg)' },
  },
  {
    id: 'grid',
    label: 'Grid',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: 'linear-gradient(rgba(61,170,122,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,170,122,0.07) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    },
  },
  {
    id: 'dots',
    label: 'Dots',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: 'radial-gradient(circle, rgba(61,170,122,0.2) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    },
  },
  {
    id: 'noise',
    label: 'Noise',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
    },
  },
  {
    id: 'diagonal',
    label: 'Lines',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: 'repeating-linear-gradient(45deg, rgba(61,170,122,0.05) 0px, rgba(61,170,122,0.05) 1px, transparent 1px, transparent 18px)',
    },
  },
  {
    id: 'topography',
    label: 'Contour',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 50 Q25 30 50 50 Q75 70 100 50' fill='none' stroke='rgba(61,170,122,0.08)' stroke-width='1.5'/%3E%3Cpath d='M0 30 Q25 10 50 30 Q75 50 100 30' fill='none' stroke='rgba(61,170,122,0.06)' stroke-width='1.5'/%3E%3Cpath d='M0 70 Q25 50 50 70 Q75 90 100 70' fill='none' stroke='rgba(61,170,122,0.06)' stroke-width='1.5'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 100px',
    },
  },
  {
    id: 'circuit',
    label: 'Circuit',
    style: {
      backgroundColor: '#1C1F1E',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='10' y='10' width='60' height='60' fill='none' stroke='rgba(61,170,122,0.07)' stroke-width='1'/%3E%3Ccircle cx='10' cy='10' r='2' fill='rgba(61,170,122,0.15)'/%3E%3Ccircle cx='70' cy='70' r='2' fill='rgba(61,170,122,0.15)'/%3E%3Ccircle cx='70' cy='10' r='2' fill='rgba(61,170,122,0.1)'/%3E%3Ccircle cx='10' cy='70' r='2' fill='rgba(61,170,122,0.1)'/%3E%3Cline x1='40' y1='10' x2='40' y2='0' stroke='rgba(61,170,122,0.08)' stroke-width='1'/%3E%3Cline x1='70' y1='40' x2='80' y2='40' stroke='rgba(61,170,122,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '80px 80px',
    },
  },
]

export default function BackdropPicker({ current, onChange, onClose }) {
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.panel}>
        <div style={s.header}>
          <span style={s.heading}>Backdrop</span>
          <button style={s.closeBtn} onClick={onClose}><X size={15}/></button>
        </div>
        <div style={s.grid}>
          {BACKDROPS.map(b => (
            <button key={b.id} onClick={() => { onChange(b.id); onClose() }} style={s.swatch}>
              <div style={{ ...s.preview, ...b.style }}>
                {current === b.id && (
                  <div style={s.checkWrap}><Check size={14} color="var(--jade)"/></div>
                )}
              </div>
              <span style={{ ...s.swatchLabel, color: current === b.id ? 'var(--jade)' : 'var(--muted)' }}>
                {b.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' },
  panel:      { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 420, maxWidth: '95vw' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--border)' },
  heading:    { fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)', letterSpacing: '0.04em' },
  closeBtn:   { background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4, cursor: 'pointer' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: 20 },
  swatch:     { display: 'flex', flexDirection: 'column', gap: 6, background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center' },
  preview:    { width: '100%', aspectRatio: '16/9', borderRadius: 6, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' },
  checkWrap:  { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' },
  swatchLabel:{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em' },
}
