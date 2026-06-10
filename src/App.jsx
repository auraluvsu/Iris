import { useState } from 'react'
import './index.css'
import PasswordGate from './components/PasswordGate'
import Topbar from './components/Topbar'
import TasksPage from './pages/TasksPage'
import ListsPage from './pages/ListsPage'

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === 'true')
  const [visible,  setVisible]  = useState(() => sessionStorage.getItem('unlocked') === 'true')
  const [page, setPage] = useState('tasks')

  const unlock = () => {
    sessionStorage.setItem('unlocked', 'true')
    setUnlocked(true)
    // tiny delay so the fade-in starts after mount
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 30))
  }

  if (!unlocked) return <PasswordGate onUnlock={unlock} />

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(6px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
    }}>
      <Topbar page={page} setPage={setPage} />
      {page === 'tasks' ? <TasksPage /> : <ListsPage />}
    </div>
  )
}
