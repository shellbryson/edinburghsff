import {
  collection, doc, getDocs, getDoc,
  setDoc, addDoc, deleteDoc, query, orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getAuditStamp } from '@/lib/firebase/audit'
import type { Event } from '@/types/event'

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

export async function getAllEvents(): Promise<Event[]> {
  const snap = await getDocs(query(collection(db, 'events'), orderBy('eventStart', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Event)
}

export async function getEventById(id: string): Promise<Event | null> {
  const snap = await getDoc(doc(db, 'events', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Event
}

export type EventFormData = {
  title: string
  summary?: string
  description?: string
  url?: string
  image?: string
  show: boolean
  eventStart: string    // ISO datetime-local string
  eventEnd?: string
  eventIsAllDay: boolean
  eventIsFeatured: boolean
  eventLocation?: string
  eventIsDigital: boolean
}

export async function saveEvent(form: EventFormData, docId?: string): Promise<string> {
  const data = stripUndefined({
    title: form.title,
    summary: form.summary || undefined,
    description: form.description || undefined,
    url: form.url || undefined,
    image: form.image || undefined,
    show: form.show,
    eventStart: Timestamp.fromDate(new Date(form.eventStart)),
    eventEnd: form.eventEnd ? Timestamp.fromDate(new Date(form.eventEnd)) : undefined,
    eventIsAllDay: form.eventIsAllDay,
    eventIsFeatured: form.eventIsFeatured,
    eventLocation: form.eventLocation || undefined,
    eventIsDigital: form.eventIsDigital,
  })
  const updated = getAuditStamp()

  if (docId) {
    const ref = doc(db, 'events', docId)
    const existing = await getDoc(ref)
    const created = existing.exists() ? existing.data().created ?? updated : updated
    await setDoc(ref, { ...data, created, updated })
    return docId
  }

  const created = updated
  const ref = await addDoc(collection(db, 'events'), { ...data, created, updated })
  return ref.id
}

export async function deleteEvent(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'events', docId))
}

export function timestampToLocal(ts: Timestamp | undefined): string {
  if (!ts) return ''
  const d = ts.toDate()
  // datetime-local format: YYYY-MM-DDTHH:MM
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}
