'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPages, deletePage, type Page } from '@/lib/firebase/pages'

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setPages(await getAllPages())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(slug)
    await deletePage(slug)
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          + New page
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-black/40">Loading…</p>
      )}

      {!loading && pages.length === 0 && (
        <div className="border border-black/10 rounded-xl p-8 text-center">
          <p className="text-sm text-black/40">No pages yet.</p>
          <Link href="/admin/pages/new" className="text-sm font-medium underline mt-2 inline-block">
            Create the first one
          </Link>
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div className="border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Title</th>
                <th className="text-left px-4 py-2.5 font-semibold text-black/60">Slug</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr
                  key={page.id}
                  className={i < pages.length - 1 ? 'border-b border-black/10' : ''}
                >
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-black/50 font-mono text-xs">/{page.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="text-black/40 hover:text-black transition-colors"
                        title="View"
                      >
                        ↗
                      </Link>
                      <Link
                        href={`/admin/pages/${page.slug}`}
                        className="text-black/60 hover:text-black font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(page.slug, page.title)}
                        disabled={deleting === page.slug}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
                      >
                        {deleting === page.slug ? '…' : 'Delete'}
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
