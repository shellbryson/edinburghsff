'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllLocations, deleteLocation } from '@/lib/firebase/locations-admin'
import type { Location } from '@/types/location'

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setLocations(await getAllLocations())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(docId)
    await deleteLocation(docId)
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Locations</h1>
        <Link
          href="/admin/locations/new"
          className="h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          + New location
        </Link>
      </div>

      {loading && <p className="text-sm text-black/40">Loading…</p>}

      {!loading && locations.length === 0 && (
        <div className="border border-black/10 rounded-xl p-8 text-center">
          <p className="text-sm text-black/40">No locations yet.</p>
          <Link href="/admin/locations/new" className="text-sm font-medium underline mt-2 inline-block">
            Add the first one
          </Link>
        </div>
      )}

      {!loading && locations.length > 0 && (
        <div className="border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Title</th>
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Address</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {locations.map((loc, i) => (
                <tr
                  key={loc.id}
                  className={i < locations.length - 1 ? 'border-b border-black/10' : ''}
                >
                  <td className="px-4 py-3 font-medium">{loc.title}</td>
                  <td className="px-4 py-3 text-black/50 text-xs">{loc.tags ?? '—'}</td>
                  <td className="px-4 py-3 text-black/50 text-xs truncate max-w-[200px]">{loc.address ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/locations/${loc.id}`}
                        className="text-black/60 hover:text-black font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(loc.id, loc.title)}
                        disabled={deleting === loc.id}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
                      >
                        {deleting === loc.id ? '…' : 'Delete'}
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
