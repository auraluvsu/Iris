import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { exportJSON } from './exportData'

describe('exportJSON', () => {
  let blobText: string

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0, 0))
    blobText = ''

    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() })
    vi.stubGlobal('Blob', class {
      constructor(parts: string[]) { blobText = parts.join('') }
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('exports cards, archived and lists with version 1', () => {
    localStorage.setItem('cards', JSON.stringify([{ id: '1', title: 'A' }]))
    localStorage.setItem('archived', JSON.stringify([{ id: '2', title: 'B' }]))
    localStorage.setItem('lists', JSON.stringify([{ id: 'l1', name: 'Groceries' }]))

    exportJSON()

    const payload = JSON.parse(blobText)
    expect(payload.version).toBe(1)
    expect(payload.cards).toEqual([{ id: '1', title: 'A' }])
    expect(payload.archived).toEqual([{ id: '2', title: 'B' }])
    expect(payload.lists).toEqual([{ id: 'l1', name: 'Groceries' }])
    expect(payload.exportedAt).toBe(new Date(2026, 5, 10, 12, 0, 0).toISOString())
  })

  it('falls back to empty arrays when storage is missing or corrupt', () => {
    localStorage.setItem('cards', '{not json')

    exportJSON()

    const payload = JSON.parse(blobText)
    expect(payload.cards).toEqual([])
    expect(payload.archived).toEqual([])
    expect(payload.lists).toEqual([])
  })

  it('names the download dashboard-export-YYYY-MM-DD.json', () => {
    const createElement = vi.spyOn(document, 'createElement')
    exportJSON()
    const anchor = createElement.mock.results.map(r => r.value).find(el => el instanceof HTMLAnchorElement)
    expect(anchor?.download).toBe('dashboard-export-2026-06-10.json')
  })
})
