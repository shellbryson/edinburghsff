import type { Metadata } from 'next'

export const revalidate = 60
import { getPageBySlugServer } from '@/lib/firebase/pages-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { MarkdownContent } from '@/components/MarkdownContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('about')
  return {
    title: page?.title ?? 'About',
    description: page?.description ?? 'About Edinburgh SFF — a community for science fiction and fantasy writers in Edinburgh.',
  }
}

export default async function AboutPage() {
  const page = await getPageBySlugServer('about')

  return (
    <PageLayout
      title={page?.title ?? 'About'}
      description={page?.description ?? 'A community for science fiction and fantasy writers in Edinburgh.'}
    >
      {page?.content && <MarkdownContent content={page.content} />}
    </PageLayout>
  )
}
