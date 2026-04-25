import {
  collection, doc, getDoc, getDocs,
  setDoc, deleteDoc, query, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export interface Page {
  id: string
  slug: string
  title: string
  content: string
  description?: string
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const snap = await getDoc(doc(db, 'pages', slug))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Page
}

export async function getAllPages(): Promise<Page[]> {
  const snap = await getDocs(query(collection(db, 'pages'), orderBy('title')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Page)
}

// slug is used as the Firestore document ID
export async function savePage(page: Omit<Page, 'id'>): Promise<void> {
  await setDoc(doc(db, 'pages', page.slug), page)
}

export async function deletePage(slug: string): Promise<void> {
  await deleteDoc(doc(db, 'pages', slug))
}
