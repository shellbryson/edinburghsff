import type { Metadata } from 'next'

export const revalidate = 60
import { getPageBySlugServer } from '@/lib/firebase/pages-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { MarkdownContent } from '@/components/MarkdownContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('events')
  return {
    title: page?.title ?? 'Events',
    description: page?.description ?? 'Upcoming events for Edinburgh SFF writers.',
  }
}

export default async function EventsPage() {
  const page = await getPageBySlugServer('events')

  return (
    <PageLayout
      title={page?.title ?? 'Events'}
      description={page?.description ?? "Readings, workshops, open-mics and community gatherings for Edinburgh's SFF writers."}
    >
      {page?.content && <MarkdownContent content={page.content} />}
    </PageLayout>
  )
}
