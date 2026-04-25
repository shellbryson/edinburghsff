import type { Metadata } from 'next'

export const revalidate = 60
import { notFound } from 'next/navigation'
import { getPageBySlugServer } from '@/lib/firebase/pages-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { MarkdownContent } from '@/components/MarkdownContent'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlugServer(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlugServer(slug)

  if (!page) notFound()

  return (
    <PageLayout title={page.title} description={page.description}>
      <MarkdownContent content={page.content} />
    </PageLayout>
  )
}
