'use client'

import { useState } from 'react'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export interface CalendarEvent {
  start: number   // Unix ms
  end?: number    // Unix ms — if present, all days in range are highlighted
}

interface Props {
  events: CalendarEvent[]
}

function floorToDay(ms: number) {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function buildEventDaySet(events: CalendarEvent[], year: number, month: number): Set<number> {
  const set = new Set<number>()
  const monthStart = new Date(year, month, 1).getTime()
  const monthEnd = new Date(year, month + 1, 0).getTime()

  for (const e of events) {
    const spanStart = Math.max(floorToDay(e.start).getTime(), monthStart)
    const spanEnd = floorToDay(e.end ?? e.start).getTime()

    // Walk day by day through the span, clamped to this month
    for (let t = spanStart; t <= Math.min(spanEnd, monthEnd); t += 86_400_000) {
      set.add(new Date(t).getDate())
    }
  }

  return set
}

export function EventsCalendar({ events }: Props) {
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === view.year && today.getMonth() === view.month

  const eventDaySet = buildEventDaySet(events, view.year, view.month)

  const firstDay = new Date(view.year, view.month, 1)
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const startPad = (firstDay.getDay() + 6) % 7  // Monday-start

  const cells: (number | null)[] = [
    ...Array<null>(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthLabel = firstDay.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const prev = () => setView(v => {
    const d = new Date(v.year, v.month - 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const next = () => setView(v => {
    const d = new Date(v.year, v.month + 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  return (
    <div className="pt-1">
      <p
        className="text-[10px] font-bold tracking-[.14em] uppercase mb-4"
        style={{ color: 'rgba(0,0,0,.45)' }}
      >
        Calendar
      </p>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-black/5"
          style={{ color: 'rgba(0,0,0,.4)' }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="text-[11px] font-semibold" style={{ color: 'rgba(0,0,0,.7)' }}>
          {monthLabel}
        </span>
        <button
          onClick={next}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-black/5"
          style={{ color: 'rgba(0,0,0,.4)' }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[9px] font-bold tracking-wider"
            style={{ color: 'rgba(0,0,0,.3)' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const hasEvent = eventDaySet.has(day)
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div key={i} className="flex flex-col items-center py-px">
              <span
                className="w-6 h-6 flex items-center justify-center rounded-full text-[11px]"
                style={{
                  fontWeight: isToday ? 700 : 400,
                  background: isToday ? 'var(--ink)' : hasEvent ? 'rgba(212,255,63,.25)' : 'transparent',
                  color: isToday ? 'var(--paper)' : 'rgba(0,0,0,.65)',
                }}
              >
                {day}
              </span>
              {hasEvent && !isToday && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: 'var(--esff-accent)' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
