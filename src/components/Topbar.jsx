import { LayoutGrid, List, Focus, Download } from 'lucide-react'
import { exportJSON } from '../utils/exportData'

export default function Topbar({ page, setPage, onFocus }) {
  return (
    <header style={styles.header}>
      <span style={styles.logo}>
        <span style={styles.logoAccent}>◈</span> dashboard
      </span>
      <nav style={styles.nav}>
        <TabBtn active={page === 'tasks'} onClick={() => setPage('tasks')} icon={<LayoutGrid size={14}/>}>Cards</TabBtn>
        <TabBtn active={page === 'lists'} onClick={() => setPage('lists')} icon={<List size={14}/>}>Lists</TabBtn>
      </nav>
      <div style={styles.actions}>
        <ActionBtn onClick={onFocus} icon={<Focus size={14}/>} label="Focus" accent />
        <ActionBtn onClick={exportJSON} icon={<Download size={14}/>} label="Export" />
      </div>
    </header>
  )
}

function TabBtn({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} style={{
      ...styles.tab,
      color: active ? 'var(--jade)' : 'var(--muted)',
      borderBottom: active ? '2px solid var(--jade)' : '2px solid transparent',
    }}>
      {icon}
      {children}
    </button>
  )
}

function ActionBtn({ onClick, icon, label, accent }) {
  return (
    <button onClick={onClick} style={{
      ...styles.action,
      background:  accent ? 'var(--jade-glow)' : 'none',
      border:      accent ? '1px solid var(--jade)' : '1px solid var(--border)',
      color:       accent ? 'var(--jade)' : 'var(--muted)',
    }}>
      {icon} {label}
    </button>
  )
}

const styles = {
  header: {
    height: 52, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 24px',
    background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 10,
  },
  logo:       { fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em' },
  logoAccent: { color: 'var(--jade)', marginRight: 8 },
  nav:        { display: 'flex', gap: 4 },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', padding: '0 14px',
    height: 52, fontSize: 13, fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.04em', transition: 'color 0.15s', cursor: 'pointer',
  },
  actions: { display: 'flex', gap: 8, alignItems: 'center' },
  action: {
    display: 'flex', alignItems: 'center', gap: 6,
    borderRadius: 'var(--radius)', padding: '6px 12px',
    fontSize: 12, fontFamily: "'DM Mono', monospace",
    cursor: 'pointer', letterSpacing: '0.03em',
  },
}
