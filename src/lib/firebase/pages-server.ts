import { adminDb } from './admin'
import type { Page } from './pages'

export async function getPageBySlugServer(slug: string): Promise<Page | null> {
  const snap = await adminDb.collection('pages').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() } as Page
}
