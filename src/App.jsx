import { useState } from 'react'
import './index.css'
import PasswordGate  from './components/PasswordGate'
import Topbar        from './components/Topbar'
import TasksPage     from './pages/TasksPage'
import ListsPage     from './pages/ListsPage'
import FocusMode     from './components/FocusMode'
import { PomodoroFloating } from './components/PomodoroTimer'
import { PomodoroProvider } from './utils/pomodoroContext'

function Dashboard() {
  const [page,      setPage]      = useState('tasks')
  const [focusOpen, setFocusOpen] = useState(false)
  const [visible,   setVisible]   = useState(false)

  // cards state lifted so FocusMode can read + mutate it
  // TasksPage manages its own localStorage but we sync via a shared reload key
  const [reloadKey, setReloadKey] = useState(0)

  const handleFocusDone = (cardId) => {
    // move card to done stage in localStorage
    try {
      const cards   = JSON.parse(localStorage.getItem('cards')) || []
      const updated = cards.map(c => c.id === cardId ? { ...c, stage: 'done' } : c)
      localStorage.setItem('cards', JSON.stringify(updated))
      setReloadKey(k => k + 1)
    } catch {}
  }

  const getLiveCards = () => {
    try { return JSON.parse(localStorage.getItem('cards')) || [] } catch { return [] }
  }

  // Fade in on mount
  useState(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 30))
  })

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(6px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
    }}>
      <Topbar page={page} setPage={setPage} onFocus={() => setFocusOpen(true)} />
      {page === 'tasks'
        ? <TasksPage key={reloadKey} />
        : <ListsPage />
      }
      <PomodoroFloating />
      {focusOpen && (
        <FocusMode
          cards={getLiveCards()}
          onClose={() => setFocusOpen(false)}
          onCardDone={handleFocusDone}
        />
      )}
    </div>
  )
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === 'true')

  const unlock = () => {
    sessionStorage.setItem('unlocked', 'true')
    setUnlocked(true)
  }

  if (!unlocked) return <PasswordGate onUnlock={unlock} />

  return (
    <PomodoroProvider>
      <Dashboard />
    </PomodoroProvider>
  )
}
