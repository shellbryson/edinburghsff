import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getEventByIdServer } from '@/lib/firebase/events-server'
import { PageLayout } from '@/components/layout/PageLayout'

export const revalidate = 60

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const event = await getEventByIdServer(id)
  if (!event) return {}
  return {
    title: event.title,
    description: event.summary,
  }
}

export default async function EventPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const event = await getEventByIdServer(id)
  if (!event) notFound()

  const date = new Date(event.eventStart)
  const dateLabel = event.eventIsAllDay
    ? date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeLabel = event.eventIsAllDay
    ? 'All day'
    : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const endDate = event.eventEnd ? new Date(event.eventEnd) : null
  const endTimeLabel = endDate && !event.eventIsAllDay
    ? endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null

  const meta = [
    event.eventIsDigital ? 'Online' : 'In person',
    timeLabel,
    endTimeLabel ? `– ${endTimeLabel}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <PageLayout meta="Events" title={event.title}>
      {/* Date / meta row */}
      <div className="flex flex-col gap-1 mb-8 pb-6 border-b border-black/10">
        <div
          className="text-[13px] font-semibold"
          style={{ color: 'rgba(0,0,0,.7)' }}
        >
          {dateLabel}
        </div>
        <div
          className="text-[11px] font-bold tracking-[.1em] uppercase"
          style={{ color: 'rgba(0,0,0,.45)' }}
        >
          {meta}
        </div>
        {event.eventLocation && (
          <div className="text-[12px] mt-1" style={{ color: 'rgba(0,0,0,.55)' }}>
            {event.eventLocation}
          </div>
        )}
      </div>

      {/* Summary */}
      {event.summary && (
        <p
          className="text-[15px] leading-[1.6] mb-6 font-medium"
          style={{ color: 'rgba(0,0,0,.75)' }}
        >
          {event.summary}
        </p>
      )}

      {/* Description markdown */}
      {event.description && (
        <div className="prose-content mb-8">
          <ReactMarkdown>{event.description}</ReactMarkdown>
        </div>
      )}

      {/* External link */}
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center h-11 px-6 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ background: 'var(--esff-accent)', color: 'var(--ink)' }}
        >
          More info ↗
        </a>
      )}

      {/* Back link */}
      <div className="mt-12">
        <Link
          href="/events"
          className="text-[12px] font-bold tracking-[.1em] uppercase"
          style={{ color: 'rgba(0,0,0,.4)' }}
        >
          ← All events
        </Link>
      </div>
    </PageLayout>
  )
}
