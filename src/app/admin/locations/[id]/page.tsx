'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getLocationById, saveLocation } from '@/lib/firebase/locations-admin'

const TAGS = ['Venue', 'Cafe', 'Library', 'Bookshop', 'Interesting']
const FACILITIES = ['Coffee', 'Alcohol', 'Meal', 'Food', 'Wifi', 'Power', 'Pet']

function parseList(val: string | undefined): string[] {
  return val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
}

function toList(items: string[]): string {
  return items.join(', ')
}

function parseCoordinatePair(value: string): { lat: string; lng: string } | null {
  if (!value.includes(',')) return null

  const [latPart, lngPart, ...rest] = value.split(',').map(s => s.trim())
  if (rest.length > 0 || !latPart || !lngPart) return null

  const latNum = Number(latPart)
  const lngNum = Number(lngPart)
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null

  return { lat: latPart, lng: lngPart }
}

export default function AdminLocationEditor() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [title, setTitle] = useState('')
  const [titleLong, setTitleLong] = useState('')
  const [nameShort, setNameShort] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [address, setAddress] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [facilities, setFacilities] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [tips, setTips] = useState('')
  const [price, setPrice] = useState('')
  const [noise, setNoise] = useState('')

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    getLocationById(params.id).then(loc => {
      if (!loc) { router.replace('/admin/locations'); return }
      setTitle(loc.title)
      setTitleLong(loc.title_long ?? '')
      setNameShort(loc.name_short ?? '')
      setLat(String(loc.lat))
      setLng(String(loc.lng))
      setAddress(loc.address ?? '')
      setUrl(loc.url ?? '')
      setImage(loc.image ?? '')
      setTags(parseList(loc.tags))
      setFacilities(parseList(loc.facilities))
      setDescription(loc.description ?? '')
      setTips(loc.tips ?? '')
      setPrice(loc.price != null ? String(loc.price) : '')
      setNoise(loc.noise != null ? String(loc.noise) : '')
      setLoading(false)
    })
  }, [params.id, isNew, router])

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item])
  }

  const handleCoordinateChange = (value: string, field: 'lat' | 'lng') => {
    const parsed = parseCoordinatePair(value)
    if (parsed) {
      setLat(parsed.lat)
      setLng(parsed.lng)
      return
    }

    if (field === 'lat') {
      setLat(value)
    } else {
      setLng(value)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Latitude and longitude must be valid numbers.')
      return
    }
    setSaving(true)
    try {
      await saveLocation({
        title,
        title_long: titleLong || undefined,
        name_short: nameShort || undefined,
        lat: latNum,
        lng: lngNum,
        address: address || undefined,
        url: url || undefined,
        image: image || undefined,
        tags: tags.length ? toList(tags) : undefined,
        facilities: facilities.length ? toList(facilities) : undefined,
        description: description || undefined,
        tips: tips || undefined,
        price: price !== '' ? Number(price) : undefined,
        noise: noise !== '' ? Number(noise) : undefined,
      }, isNew ? undefined : params.id)
      router.push('/admin/locations')
    } catch (err) {
      console.error('saveLocation failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-black/40">Loading…</p>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/locations" className="text-sm text-black/40 hover:text-black transition-colors">
          ← Locations
        </Link>
        <span className="text-black/20">/</span>
        <h1 className="text-xl font-bold tracking-tight">
          {isNew ? 'New location' : title}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Basic info</h2>

          <Field label="Title" required>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Central Library" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name">
              <input value={titleLong} onChange={e => setTitleLong(e.target.value)} placeholder="e.g. Edinburgh Central Library" className={inputCls} />
            </Field>
            <Field label="Short name">
              <input value={nameShort} onChange={e => setNameShort(e.target.value)} placeholder="e.g. Central Lib" className={inputCls} />
            </Field>
          </div>

          <Field label="Address">
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. George IV Bridge, Edinburgh EH1 1EG" className={inputCls} />
          </Field>

          <Field label="Website URL">
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" className={inputCls} />
          </Field>

          <Field label="Image URL">
            <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" className={inputCls} />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Coordinates</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude" required>
              <input value={lat} onChange={e => handleCoordinateChange(e.target.value, 'lat')} required placeholder="55.9533" className={inputCls} />
            </Field>
            <Field label="Longitude" required>
              <input value={lng} onChange={e => handleCoordinateChange(e.target.value, 'lng')} required placeholder="-3.1883" className={inputCls} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Type</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleItem(tags, setTags, tag)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={tags.includes(tag)
                  ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
                  : { background: 'transparent', color: 'rgba(0,0,0,.6)', borderColor: 'rgba(0,0,0,.2)' }
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {FACILITIES.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleItem(facilities, setFacilities, f)}
                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={facilities.includes(f)
                  ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
                  : { background: 'transparent', color: 'rgba(0,0,0,.6)', borderColor: 'rgba(0,0,0,.2)' }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Ratings <span className="normal-case font-normal">(out of 10)</span></h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price">
              <input type="number" min="0" max="10" value={price} onChange={e => setPrice(e.target.value)} placeholder="0–10" className={inputCls} />
            </Field>
            <Field label="Noise">
              <input type="number" min="0" max="10" value={noise} onChange={e => setNoise(e.target.value)} placeholder="0–10" className={inputCls} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40">Content</h2>
          <Field label="Description" hint="Markdown supported">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Describe the venue…" className={`${inputCls} resize-y`} />
          </Field>
          <Field label="Tips" hint="Markdown supported">
            <textarea value={tips} onChange={e => setTips(e.target.value)} rows={4} placeholder="Insider tips…" className={`${inputCls} resize-y`} />
          </Field>
        </section>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            {saving ? 'Saving…' : 'Save location'}
          </button>
          <Link
            href="/admin/locations"
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
