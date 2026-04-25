import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events for Edinburgh SFF writers.',
}

export default function EventsPage() {
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
        Events<span style={{ color: 'var(--esff-accent)' }}>.</span>
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,.6)', maxWidth: '36ch' }}>
        Readings, workshops, open-mics and community gatherings for Edinburgh&apos;s SFF writers.
      </p>

      <div
        className="mt-12 text-sm"
        style={{ color: 'rgba(0,0,0,.4)' }}
      >
        Events coming soon.
      </div>
    </main>
  )
}
