import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function PasswordGate({ onUnlock }) {
  const [val,      setVal]      = useState('')
  const [shake,    setShake]    = useState(false)
  const [fading,   setFading]   = useState(false)

  const attempt = () => {
    const correct = import.meta.env.VITE_APP_PASSWORD
    if (val === correct) {
      setFading(true)
      setTimeout(onUnlock, 500)
    } else {
      setShake(true)
      setVal('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{ ...styles.wrap, opacity: fading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
      <div style={styles.box} className={shake ? 'shake' : ''}>
        <div style={styles.icon}><Lock size={20} color="var(--jade)" /></div>
        <p style={styles.label}>Enter password</p>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          autoFocus
          style={styles.input}
          placeholder="••••••••"
        />
        <button onClick={attempt} style={styles.btn}>Unlock</button>
      </div>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .shake { animation: shake 0.45s ease; }
      `}</style>
    </div>
  )
}

const styles = {
  wrap: {
    height: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--bg)',
  },
  box: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '36px 40px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    width: 300,
  },
  icon: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'var(--jade-glow)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  label: {
    fontFamily: "'DM Mono', monospace", fontSize: 13,
    color: 'var(--muted)', letterSpacing: '0.04em',
  },
  input: {
    width: '100%', background: 'var(--elevated)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '10px 14px', color: 'var(--text)',
    fontSize: 15, outline: 'none', textAlign: 'center', letterSpacing: '0.1em',
  },
  btn: {
    width: '100%', background: 'var(--jade)', color: '#0D1A13',
    border: 'none', borderRadius: 'var(--radius)', padding: '10px',
    fontWeight: 600, fontSize: 13, fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.05em', marginTop: 4, cursor: 'pointer',
  },
}
