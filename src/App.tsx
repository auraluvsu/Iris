import { useState, useEffect } from 'react'
import './index.css'
import Topbar from './components/Topbar'
import TasksPage from './pages/TasksPage'
import ListsPage from './pages/ListsPage'
import FocusMode from './components/FocusMode'
import { PomodoroFloating } from './components/PomodoroTimer'
import { PomodoroProvider } from './utils/pomodoroContext'

interface Card {
  id: string
  title: string
  desc: string
  status: 'urgent' | 'pressing' | 'lenient'
  stage: 'todo' | 'inprogress' | 'done'
  subcards: Array<{ id: string; text: string; done: boolean }>
  links: Array<{ id: string; url: string; title: string }>
  dueDate: string
}

function Dashboard() {
  const [page, setPage] = useState<'tasks' | 'lists'>('tasks')
  const [focusOpen, setFocusOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const handleFocusDone = (cardId: string): void => {
    try {
      const cards = JSON.parse(localStorage.getItem('cards')) as Card[] | null || []
      const updated = cards.map(c => c.id === cardId ? { ...c, stage: 'done' as const } : c)
      localStorage.setItem('cards', JSON.stringify(updated))
      setReloadKey(k => k + 1)
    } catch {}
  }

  const getLiveCards = (): Card[] => {
    try { return JSON.parse(localStorage.getItem('cards')) || [] } catch { return [] }
  }

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 30))
  }, [])

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
  return (
    <PomodoroProvider>
      <Dashboard />
    </PomodoroProvider>
  )
}
