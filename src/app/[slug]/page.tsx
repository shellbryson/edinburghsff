import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

// Fetch page content from Firebase by slug
async function getPage(slug: string) {
  // TODO: replace with real Firestore fetch
  // const snap = await getDoc(doc(db, 'pages', slug))
  // if (!snap.exists()) return null
  // return snap.data()
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: (page as any).title,
    description: (page as any).description,
  }
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* MarkdownContent client component goes here */}
      <pre>{JSON.stringify(page, null, 2)}</pre>
    </main>
  )
}
