/**
 * Collects all app data from localStorage and triggers a JSON download.
 */
export function exportJSON() {
  const cards    = safeLoad('cards',    [])
  const archived = safeLoad('archived', [])
  const lists    = safeLoad('lists',    [])

  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    cards,
    archived,
    lists,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `dashboard-export-${formatDateStamp()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function safeLoad(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function formatDateStamp() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
