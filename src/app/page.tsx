import type { Metadata } from 'next'
import { getPageBySlugServer } from '@/lib/firebase/pages-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { MarkdownContent } from '@/components/MarkdownContent'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('home')
  return {
    title: page?.title ?? 'Edinburgh SFF',
    description: page?.description ?? 'Resources and community for science fiction and fantasy writers in Edinburgh.',
  }
}

export default async function HomePage() {
  const page = await getPageBySlugServer('home')

  return (
    <PageLayout
      title={page?.title ?? 'Edinburgh SFF'}
      description={page?.description ?? 'Resources and community for science fiction and fantasy writers in Edinburgh.'}
    >
      {page?.content && <MarkdownContent content={page.content} />}
    </PageLayout>
  )
}
