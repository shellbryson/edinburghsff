'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SectionRule } from '@/components/SectionRule'
import type { SerializedEvent } from '@/lib/firebase/events-server'

type Filter = 'upcoming' | 'this-month'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'this-month', label: 'This Month' },
]

function groupByMonth(events: SerializedEvent[]): [string, SerializedEvent[]][] {
  const map: Record<string, SerializedEvent[]> = {}
  for (const e of events) {
    const key = new Date(e.eventStart).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    if (!map[key]) map[key] = []
    map[key].push(e)
  }
  return Object.entries(map)
}

function EventCard({ event }: { event: SerializedEvent }) {
  const date = new Date(event.eventStart)
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  const time = event.eventIsAllDay
    ? 'All day'
    : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const meta = [
    event.eventIsDigital ? 'Online' : 'In person',
    time,
  ].filter(Boolean).join(' · ')

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="flex items-stretch gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/70">
        <div
          className="w-16 shrink-0 rounded-xl flex flex-col items-center justify-center py-3 px-2"
          style={{ background: 'rgba(212,255,63,.22)' }}
        >
          <span
            className="text-[26px] font-extrabold leading-none tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {day}
          </span>
          <span className="text-[9px] font-bold tracking-[.12em] mt-0.5">{month}</span>
        </div>

        <div className="flex-1 min-w-0 py-1">
          <div
            className="text-[10px] font-bold tracking-[.12em] uppercase"
            style={{ color: 'rgba(0,0,0,.55)' }}
          >
            {meta}
          </div>
          <h3
            className="text-[17px] font-bold leading-[1.2] tracking-[-0.02em] my-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {event.title}
          </h3>
          {event.eventLocation && (
            <div className="text-[12px]" style={{ color: 'rgba(0,0,0,.6)' }}>
              at {event.eventLocation}
            </div>
          )}
          {event.summary && (
            <div className="text-[11px] mt-1 line-clamp-2" style={{ color: 'rgba(0,0,0,.5)' }}>
              {event.summary}
            </div>
          )}
        </div>

        <div className="self-center text-[22px] pr-2" style={{ color: 'rgba(0,0,0,.3)' }}>›</div>
      </div>
    </Link>
  )
}

function MonthGroup({ month, events }: { month: string; events: SerializedEvent[] }) {
  return (
    <section className="mb-6">
      <div
        className="text-[11px] font-bold tracking-[.14em] uppercase px-2 pb-3"
        style={{ color: 'rgba(0,0,0,.5)' }}
      >
        {month}
      </div>
      <div className="flex flex-col gap-1">
        {events.map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </section>
  )
}

interface Props {
  events: SerializedEvent[]
}

export function EventsList({ events }: Props) {
  const [filter, setFilter] = useState<Filter>('upcoming')

  const now = Date.now()
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0)
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999)

  const upcoming = events.filter(e => e.eventStart >= now)
  const past = events.filter(e => e.eventStart < now).reverse()
  const thisMonth = events.filter(e => e.eventStart >= monthStart.getTime() && e.eventStart <= monthEnd.getTime())

  const upcomingGroups = groupByMonth(upcoming)
  const pastGroups = groupByMonth(past)
  const thisMonthGroups = groupByMonth(thisMonth)

  const isEmpty = filter === 'upcoming'
    ? events.length === 0
    : thisMonth.length === 0

  return (
    <div>
      {/* Filter tabs */}
      <div
        className="inline-flex p-0.5 rounded-full mb-6"
        style={{ background: 'rgba(0,0,0,.06)' }}
        role="tablist"
      >
        {FILTERS.map(f => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: filter === f.id ? '#ffffff' : 'transparent',
              color: filter === f.id ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.45)',
              boxShadow: filter === f.id ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <p className="text-sm" style={{ color: 'rgba(0,0,0,.45)' }}>
          No events {filter === 'this-month' ? 'this month' : 'scheduled yet — check back soon'}.
        </p>
      )}

      {/* Upcoming view */}
      {filter === 'upcoming' && (
        <>
          {upcomingGroups.map(([month, evs]) => (
            <MonthGroup key={month} month={month} events={evs} />
          ))}
          {past.length > 0 && (
            <>
              <SectionRule label="Past events" />
              {pastGroups.map(([month, evs]) => (
                <MonthGroup key={month} month={month} events={evs} />
              ))}
            </>
          )}
        </>
      )}

      {/* This Month view */}
      {filter === 'this-month' && (
        <>
          {thisMonthGroups.map(([month, evs]) => (
            <MonthGroup key={month} month={month} events={evs} />
          ))}
        </>
      )}
    </div>
  )
}
