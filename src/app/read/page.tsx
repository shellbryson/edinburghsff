import type { Metadata } from 'next'

export const revalidate = 60
import { getPageBySlugServer } from '@/lib/firebase/pages-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { MarkdownContent } from '@/components/MarkdownContent'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('read')
  return {
    title: page?.title ?? 'Read',
    description: page?.description ?? "Essays, interviews and dispatches from Edinburgh's SFF writing community.",
  }
}

export default async function ReadPage() {
  const page = await getPageBySlugServer('read')

  return (
    <PageLayout
      title={page?.title ?? 'Read'}
      description={page?.description ?? "Essays, interviews, reviews and dispatches from Edinburgh's science fiction and fantasy writing community."}
    >
      {page?.content && <MarkdownContent content={page.content} />}
    </PageLayout>
  )
}
