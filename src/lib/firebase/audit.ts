import { serverTimestamp, type FieldValue } from 'firebase/firestore'
import { auth } from '@/lib/firebase/config'

export type AuditStamp = {
  email: string
  uuid: string
  timestamp: FieldValue
}

export function getAuditStamp(): AuditStamp {
  const user = auth.currentUser
  if (!user?.uid || !user.email) {
    throw new Error('You must be logged in to save changes.')
  }

  return {
    email: user.email,
    uuid: user.uid,
    timestamp: serverTimestamp(),
  }
}