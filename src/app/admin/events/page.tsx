'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllEvents, deleteEvent } from '@/lib/firebase/events-admin'
import type { Event } from '@/types/event'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setEvents(await getAllEvents())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(docId)
    await deleteEvent(docId)
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Events</h1>
        <Link
          href="/admin/events/new"
          className="h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          + New event
        </Link>
      </div>

      {loading && <p className="text-sm text-black/40">Loading…</p>}

      {!loading && events.length === 0 && (
        <div className="border border-black/10 rounded-xl p-8 text-center">
          <p className="text-sm text-black/40">No events yet.</p>
          <Link href="/admin/events/new" className="text-sm font-medium underline mt-2 inline-block">
            Add the first one
          </Link>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Title</th>
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr
                  key={event.id}
                  className={i < events.length - 1 ? 'border-b border-black/10' : ''}
                >
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-black/50 text-xs tabular-nums">
                    {event.eventStart?.toDate().toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    }) ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      event.show
                        ? 'bg-green-50 text-green-700'
                        : 'bg-black/5 text-black/40'
                    }`}>
                      {event.show ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-black/60 hover:text-black font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deleting === event.id}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
                      >
                        {deleting === event.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
