import type { Timestamp } from 'firebase/firestore'

export interface Event {
  id: string
  title: string
  summary?: string
  description?: string
  url?: string
  image?: string
  show?: boolean
  eventStart: Timestamp
  eventEnd?: Timestamp
  eventIsAllDay?: boolean
  eventIsFeatured?: boolean
  eventLocation?: string
  eventIsDigital?: boolean
}
