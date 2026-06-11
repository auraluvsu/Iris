interface Card {
  id: string
  title: string
  desc: string
  status: 'urgent' | 'pressing' | 'lenient'
  stage: 'todo' | 'inprogress' | 'done'
  subcards: Array<{ id: string; text: string; done: boolean }>
  links: Array<{ id: string; url: string; title: string }>
  dueDate: string
  archivedAt?: string
}

interface ExportPayload {
  exportedAt: string
  version: number
  cards: Card[]
  archived: Card[]
  lists: unknown[]
}

/**
 * Collects all app data from localStorage and triggers a JSON download.
 */
export function exportJSON(): void {
  const cards = safeLoad<Card[]>('cards', [])
  const archived = safeLoad<Card[]>('archived', [])
  const lists = safeLoad<unknown[]>('lists', [])

  const payload: ExportPayload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    cards,
    archived,
    lists,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dashboard-export-${formatDateStamp()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function safeLoad<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback } catch { return fallback }
}

function formatDateStamp(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
