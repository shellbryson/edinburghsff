'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getEventById, saveEvent, timestampToLocal } from '@/lib/firebase/events-admin'

export default function AdminEventEditor() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [eventStart, setEventStart] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [show, setShow] = useState(false)
  const [eventIsAllDay, setEventIsAllDay] = useState(false)
  const [eventIsFeatured, setEventIsFeatured] = useState(false)
  const [eventIsDigital, setEventIsDigital] = useState(false)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    getEventById(params.id).then(event => {
      if (!event) { router.replace('/admin/events'); return }
      setTitle(event.title)
      setSummary(event.summary ?? '')
      setDescription(event.description ?? '')
      setUrl(event.url ?? '')
      setImage(event.image ?? '')
      setEventStart(timestampToLocal(event.eventStart))
      setEventEnd(timestampToLocal(event.eventEnd))
      setEventLocation(event.eventLocation ?? '')
      setShow(event.show ?? false)
      setEventIsAllDay(event.eventIsAllDay ?? false)
      setEventIsFeatured(event.eventIsFeatured ?? false)
      setEventIsDigital(event.eventIsDigital ?? false)
      setLoading(false)
    })
  }, [params.id, isNew, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!eventStart) { setError('Start date is required.'); return }
    setSaving(true)
    try {
      await saveEvent({
        title,
        summary: summary || undefined,
        description: description || undefined,
        url: url || undefined,
        image: image || undefined,
        show,
        eventStart,
        eventEnd: eventEnd || undefined,
        eventIsAllDay,
        eventIsFeatured,
        eventLocation: eventLocation || undefined,
        eventIsDigital,
      }, isNew ? undefined : params.id)
      router.push('/admin/events')
    } catch (err) {
      console.error('saveEvent failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-black/40">Loading…</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/events" className="text-sm text-black/40 hover:text-black transition-colors">
          ← Events
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="text-xl font-bold tracking-tight">
          {isNew ? 'New event' : title}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <section className="space-y-4">
          <h2 className={sectionHeading}>Basic info</h2>

          <Field label="Title" required>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Monthly Write-in" className={inputCls} />
          </Field>

          <Field label="Summary" hint="short description shown in listings">
            <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="A brief one-liner about the event" className={inputCls} />
          </Field>

          <Field label="Description" hint="Markdown supported">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={8} placeholder="Full event details…" className={`${inputCls} resize-y`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Website URL">
              <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" className={inputCls} />
            </Field>
            <Field label="Image URL">
              <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" className={inputCls} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={sectionHeading}>Date &amp; time</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start" required>
              <input type="datetime-local" value={eventStart} onChange={e => setEventStart(e.target.value)} required className={inputCls} />
            </Field>
            <Field label="End">
              <input type="datetime-local" value={eventEnd} onChange={e => setEventEnd(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Location">
            <input value={eventLocation} onChange={e => setEventLocation(e.target.value)} placeholder="e.g. Summerhall, Edinburgh" className={inputCls} />
          </Field>

          <div className="flex flex-wrap gap-4">
            <Toggle label="All day" value={eventIsAllDay} onChange={setEventIsAllDay} />
            <Toggle label="Online / digital" value={eventIsDigital} onChange={setEventIsDigital} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={sectionHeading}>Visibility</h2>
          <div className="flex flex-wrap gap-4">
            <Toggle label="Published" value={show} onChange={setShow} />
            <Toggle label="Featured" value={eventIsFeatured} onChange={setEventIsFeatured} />
          </div>
        </section>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            {saving ? 'Saving…' : 'Save event'}
          </button>
          <Link
            href="/admin/events"
            className="h-10 px-5 rounded-lg text-sm font-medium border border-black/20 flex items-center hover:bg-black/3 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

const inputCls = 'w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20'
const sectionHeading = 'text-xs font-semibold uppercase tracking-widest text-black/40'

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="ml-2 font-normal text-black/40 text-xs">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange }: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-(--ink)' : 'bg-black/20'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}
