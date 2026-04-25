import {
  collection, doc, getDocs, getDoc,
  setDoc, deleteDoc, query, orderBy, where, limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getAuditStamp } from '@/lib/firebase/audit'

export interface Page {
  id: string
  slug: string
  title: string
  content: string
  description?: string
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const snap = await getDocs(query(collection(db, 'pages'), where('slug', '==', slug), limit(1)))
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Page
}

export async function getAllPages(): Promise<Page[]> {
  const snap = await getDocs(query(collection(db, 'pages'), orderBy('title')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Page)
}

export async function savePage(page: Omit<Page, 'id'>, docId?: string): Promise<void> {
  const ref = doc(db, 'pages', docId ?? page.slug)
  const existing = await getDoc(ref)
  const updated = getAuditStamp()
  const created = existing.exists() ? existing.data().created ?? updated : updated

  await setDoc(ref, { ...page, created, updated })
}

export async function deletePage(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'pages', docId))
}
