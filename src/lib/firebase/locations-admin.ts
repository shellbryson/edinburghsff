import {
  collection, doc, getDocs, getDoc,
  setDoc, addDoc, deleteDoc, query, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getAuditStamp } from '@/lib/firebase/audit'
import type { Location } from '@/types/location'

export async function getAllLocations(): Promise<Location[]> {
  const snap = await getDocs(query(collection(db, 'locations'), orderBy('title')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Location)
}

export async function getLocationById(id: string): Promise<Location | null> {
  const snap = await getDoc(doc(db, 'locations', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Location
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

export async function saveLocation(location: Omit<Location, 'id'>, docId?: string): Promise<string> {
  const data = stripUndefined(location as Record<string, unknown>)
  const updated = getAuditStamp()

  if (docId) {
    const ref = doc(db, 'locations', docId)
    const existing = await getDoc(ref)
    const created = existing.exists() ? existing.data().created ?? updated : updated
    await setDoc(ref, { ...data, created, updated })
    return docId
  }

  const created = updated
  const ref = await addDoc(collection(db, 'locations'), { ...data, created, updated })
  return ref.id
}

export async function deleteLocation(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'locations', docId))
}
