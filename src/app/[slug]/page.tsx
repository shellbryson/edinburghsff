import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getPageBySlug } from '@/lib/firebase/pages'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) notFound()

  return (
    <main className="flex-1 px-5 pt-12 pb-28 max-w-2xl mx-auto w-full">
      <h1
        className="text-4xl font-bold tracking-tight leading-tight mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {page.title}
      </h1>
      <div className="prose-content">
        <ReactMarkdown>{page.content}</ReactMarkdown>
      </div>
    </main>
  )
}
