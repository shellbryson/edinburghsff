import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Edinburgh SFF — a community for science fiction and fantasy writers in Edinburgh.',
}

export default function AboutPage() {
  return (
    <main className="flex-1 px-5 pt-14 pb-28">
      <p
        className="text-[10px] font-semibold tracking-[.12em] uppercase mb-3"
        style={{ color: 'rgba(0,0,0,.5)' }}
      >
        Edinburgh SFF
      </p>
      <h1
        className="text-[52px] leading-[.95] tracking-[-0.03em] font-bold mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        About<span style={{ color: 'var(--esff-accent)' }}>.</span>
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,.6)', maxWidth: '36ch' }}>
        A community for science fiction and fantasy writers in Edinburgh. We run workshops, readings, and maintain a map of the city&apos;s best writing venues.
      </p>
    </main>
  )
}
