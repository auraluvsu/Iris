import { X, Check } from 'lucide-react'
import { CSSProperties } from 'react'

export interface Backdrop {
  id: string
  label: string
  style: CSSProperties
}

export const BACKDROPS: Backdrop[] = [
  {
    id: 'default',
    label: 'Default',
    style: { background: 'var(--bg)' },
  },
  ...[
    'benjamin-voros-phIFdC6lA4E',
    'breno-machado-in9-n0JwgZ0',
    'cristina-gottardi-CSpjU6hYo_0',
    'daniel-leone-v7daTKlZzaw',
    'elias-var-T3JOkIJImeo',
    'jms-kFHz9Xh3PPU',
    'kalen-emsley-Bkci_8qcdvQ',
    'luca-bravo-zAjdgNXsMeg',
    'luca-micheli-ruWkmt3nU58',
    'nasa-Q1p7bh3SHj8',
    'pietro-de-grandi-T7K4aEPoGGk',
    'qingbao-meng-01_igFr7hd4',
    'ran-liwen-y8JAcW8i53M',
    'urban-vintage-78A265wPiO4',
  ].map((file, i): Backdrop => ({
    id: `photo-${i + 1}`,
    label: `Photo ${i + 1}`,
    style: {
      backgroundImage: `url('/backdrops/${file}.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  })),
]

interface BackdropPickerProps {
  current: string
  onChange: (id: string) => void
  onClose: () => void
}

export default function BackdropPicker({ current, onChange, onClose }: BackdropPickerProps) {
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.panel}>
        <div style={s.header}>
          <span style={s.heading}>Backdrop</span>
          <button style={s.closeBtn} onClick={onClose}><X size={15} /></button>
        </div>
        <div style={s.grid}>
          {BACKDROPS.map(b => (
            <button key={b.id} onClick={() => { onChange(b.id); onClose() }} style={s.swatch}>
              <div style={{ ...s.preview, ...b.style }}>
                {current === b.id && (
                  <div style={s.checkWrap}><Check size={14} color="var(--jade)" /></div>
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

const s: Record<string, CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' },
  panel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 420, maxWidth: '95vw' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--border)' },
  heading: { fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)', letterSpacing: '0.04em' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: 20 },
  swatch: { display: 'flex', flexDirection: 'column', gap: 6, background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center' },
  preview: { width: '100%', aspectRatio: '16/9', borderRadius: 6, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' },
  checkWrap: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' },
  swatchLabel: { fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em' },
}
