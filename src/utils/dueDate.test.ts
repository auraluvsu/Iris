import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getDueState, formatDue } from './dueDate'

describe('getDueState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0, 0)) // 10 Jun 2026, local noon
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns none for an empty date', () => {
    expect(getDueState('')).toEqual({ state: 'none', label: '', color: '' })
  })

  it('marks a date in the past as overdue', () => {
    const result = getDueState('2026-06-08')
    expect(result.state).toBe('overdue')
    expect(result.label).toBe('2d overdue')
    expect(result.color).toBe('var(--urgent)')
  })

  it('marks today as overdue with a "Due today" label', () => {
    expect(getDueState('2026-06-10')).toEqual({
      state: 'overdue',
      label: 'Due today',
      color: 'var(--urgent)',
    })
  })

  it('marks 1 to 5 days out as soon', () => {
    expect(getDueState('2026-06-11')).toEqual({ state: 'soon', label: '1d left', color: 'var(--pressing)' })
    expect(getDueState('2026-06-15')).toEqual({ state: 'soon', label: '5d left', color: 'var(--pressing)' })
  })

  it('marks more than 5 days out as ok', () => {
    expect(getDueState('2026-06-16')).toEqual({ state: 'ok', label: '6d left', color: 'var(--lenient)' })
  })

  it('ignores the time of day when comparing dates', () => {
    vi.setSystemTime(new Date(2026, 5, 10, 23, 59, 0))
    expect(getDueState('2026-06-10').state).toBe('overdue')
    expect(getDueState('2026-06-11').state).toBe('soon')
  })
})

describe('formatDue', () => {
  it('returns an empty string for an empty date', () => {
    expect(formatDue('')).toBe('')
  })

  it('formats as day and short month in en-GB', () => {
    expect(formatDue('2026-06-12')).toBe('12 Jun')
  })
})
