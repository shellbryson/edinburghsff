'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPageBySlug, savePage } from '@/lib/firebase/pages'

export default function AdminPageEditor() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [docId, setDocId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    getPageBySlug(params.id).then(page => {
      if (!page) { router.replace('/admin/pages'); return }
      setDocId(page.id)
      setTitle(page.title)
      setSlug(page.slug)
      setDescription(page.description ?? '')
      setContent(page.content)
      setLoading(false)
    })
  }, [params.id, isNew, router])

  // Auto-generate slug from title when creating
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (isNew) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!slug.trim()) { setError('Slug is required.'); return }
    setSaving(true)
    try {
      await savePage({ title, slug, description, content }, isNew ? undefined : docId)
      router.push('/admin/pages')
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-black/40">Loading…</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pages" className="text-sm text-black/40 hover:text-black transition-colors">
          ← Pages
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="text-xl font-bold tracking-tight">
          {isNew ? 'New page' : title}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="e.g. About Edinburgh SFF"
            className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Slug
            <span className="ml-2 font-normal text-black/40 text-xs">
              — public URL will be /{slug || '…'}
            </span>
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            disabled={!isNew}
            placeholder="e.g. about"
            className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black/20 disabled:bg-black/[0.03] disabled:text-black/40"
          />
          {!isNew && (
            <p className="text-xs text-black/40">Slug cannot be changed after creation.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Description
            <span className="ml-2 font-normal text-black/40 text-xs">— used for SEO meta description</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A short sentence describing this page."
            className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Content
            <span className="ml-2 font-normal text-black/40 text-xs">— Markdown supported</span>
          </label>
          <textarea
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={18}
            placeholder="Write your page content in Markdown…"
            className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/20 resize-y"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            {saving ? 'Saving…' : 'Save page'}
          </button>
          <Link
            href="/admin/pages"
            className="h-10 px-5 rounded-lg text-sm font-medium border border-black/20 flex items-center hover:bg-black/[0.03] transition-colors"
          >
            Cancel
          </Link>
          {!isNew && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-sm text-black/40 hover:text-black transition-colors"
            >
              View live ↗
            </a>
          )}
        </div>
      </form>
    </div>
  )
}
