import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicEventsServer, type SerializedEvent } from '@/lib/firebase/events-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { SectionRule } from '@/components/SectionRule'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: "Readings, workshops, open-mics and community gatherings for Edinburgh's SFF writers.",
}

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

  const inner = (
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
  )

  return event.url ? (
    <a href={event.url} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  )
}

export default async function EventsPage() {
  const now = Date.now()
  const all = await getPublicEventsServer()
  const upcoming = all.filter(e => e.eventStart >= now)
  const past = all.filter(e => e.eventStart < now).reverse()

  const upcomingGroups = groupByMonth(upcoming)
  const pastGroups = groupByMonth(past)

  return (
    <PageLayout
      meta="Upcoming"
      title="Events"
      description="Readings, workshops, open mics — across the city."
    >
      {all.length === 0 && (
        <p className="text-sm" style={{ color: 'rgba(0,0,0,.45)' }}>
          No events scheduled yet — check back soon.
        </p>
      )}

      {upcomingGroups.map(([month, events]) => (
        <section key={month} className="mb-6">
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
      ))}

      {past.length > 0 && (
        <>
          <SectionRule label="Past events" />
          {pastGroups.map(([month, events]) => (
            <section key={month} className="mb-6 mt-4">
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
          ))}
        </>
      )}
    </PageLayout>
  )
}
