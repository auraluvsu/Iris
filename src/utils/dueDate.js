/**
 * Returns the due-date dot state for a card.
 * @param {string|null} dueDate  ISO date string "YYYY-MM-DD" or null
 * @returns {{ state: 'overdue'|'soon'|'ok'|'none', label: string, color: string }}
 */
export function getDueState(dueDate) {
  if (!dueDate) return { state: 'none', label: '', color: '' }

  // Compare calendar dates only — strip time
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')

  const diffMs   = due - today
  const diffDays = Math.round(diffMs / 86_400_000)

  if (diffDays <= 0) return { state: 'overdue', label: diffDays === 0 ? 'Due today' : `${Math.abs(diffDays)}d overdue`, color: 'var(--urgent)' }
  if (diffDays <= 5) return { state: 'soon',    label: `${diffDays}d left`,                                              color: 'var(--pressing)' }
  return               { state: 'ok',      label: `${diffDays}d left`,                                              color: 'var(--lenient)' }
}

/** Format "YYYY-MM-DD" → "12 Jun" for display */
export function formatDue(dueDate) {
  if (!dueDate) return ''
  const d = new Date(dueDate + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
