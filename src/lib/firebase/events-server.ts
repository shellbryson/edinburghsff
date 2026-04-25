import { adminDb } from './admin'

export interface SerializedEvent {
  id: string
  title: string
  summary?: string
  description?: string
  url?: string
  image?: string
  eventStart: number   // Unix ms — serializable across server/client boundary
  eventEnd?: number
  eventIsAllDay: boolean
  eventIsFeatured: boolean
  eventLocation?: string
  eventIsDigital: boolean
}

export async function getPublicEventsServer(): Promise<SerializedEvent[]> {
  const snap = await adminDb
    .collection('events')
    .orderBy('eventStart', 'asc')
    .get()

  return snap.docs
    .map(d => {
      const data = d.data()
      if (!data.eventStart) return null
      return {
        id: d.id,
        title: data.title ?? '',
        summary: data.summary ?? undefined,
        description: data.description ?? undefined,
        url: data.url ?? undefined,
        image: data.image ?? undefined,
        eventStart: data.eventStart.toMillis(),
        eventEnd: data.eventEnd?.toMillis() ?? undefined,
        eventIsAllDay: data.eventIsAllDay ?? false,
        eventIsFeatured: data.eventIsFeatured ?? false,
        eventLocation: data.eventLocation ?? undefined,
        eventIsDigital: data.eventIsDigital ?? false,
      }
    })
    .filter(Boolean) as SerializedEvent[]
}
