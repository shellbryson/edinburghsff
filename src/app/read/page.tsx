import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Read',
  description: 'Essays, interviews and dispatches from Edinburgh\'s SFF writing community.',
}

export default function ReadPage() {
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
        Read<span style={{ color: 'var(--esff-accent)' }}>.</span>
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,.6)', maxWidth: '36ch' }}>
        Essays, interviews, reviews and dispatches from Edinburgh&apos;s science fiction and fantasy writing community.
      </p>

      <div
        className="mt-12 text-sm"
        style={{ color: 'rgba(0,0,0,.4)' }}
      >
        Articles coming soon.
      </div>
    </main>
  )
}
