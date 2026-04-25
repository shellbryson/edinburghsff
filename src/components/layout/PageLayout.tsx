import { MobileAsideToggle } from './MobileAsideToggle'

interface PageLayoutProps {
  title: string
  meta?: string        // eyebrow label — defaults to "Edinburgh SFF"
  description?: string
  asideLabel?: string  // mobile toggle label — defaults to "More"
  children?: React.ReactNode
  aside?: React.ReactNode
}

function PageHeader({ title, meta, description }: { title: string; meta: string; description?: string }) {
  return (
    <>
      <p
        className="text-[10px] font-bold tracking-[.14em] uppercase mb-4"
        style={{ color: 'rgba(0,0,0,.45)', fontFamily: 'var(--font-body)' }}
      >
        {meta}
      </p>
      <h1
        className="text-[52px] leading-[.95] tracking-[-0.03em] font-bold"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}<span style={{ color: 'var(--esff-accent)' }}>.</span>
      </h1>
      {description && (
        <p
          className="text-[13px] leading-[1.45] mt-3"
          style={{ color: 'rgba(0,0,0,.6)', maxWidth: '28ch' }}
        >
          {description}
        </p>
      )}
    </>
  )
}

export function PageLayout({
  title,
  meta = 'Edinburgh SFF',
  description,
  asideLabel = 'More',
  children,
  aside,
}: PageLayoutProps) {
  return (
    <main className="flex-1 pb-28">
      <div className={`mx-auto px-5 ${aside ? 'max-w-5xl' : 'max-w-3xl'}`}>

        {/* Mobile: header + optional collapsible toggle */}
        <header className="pt-12 pb-8 border-b border-black/10 lg:hidden">
          <PageHeader title={title} meta={meta} description={description} />
          {aside && (
            <MobileAsideToggle label={asideLabel}>
              {aside}
            </MobileAsideToggle>
          )}
        </header>

        {/* Desktop: three-column grid */}
        <div className={`hidden lg:grid lg:pt-12 lg:gap-10 ${aside ? 'lg:grid-cols-[200px_1fr_200px]' : 'lg:grid-cols-[200px_1fr]'}`}>

          {/* Left: sticky header */}
          <div className="self-start sticky top-8">
            <PageHeader title={title} meta={meta} description={description} />
          </div>

          {/* Center: main content */}
          <div className="border-l border-black/10 pl-10">
            {children}
          </div>

          {/* Right: functional (optional) */}
          {aside && (
            <div className="border-l border-black/10 pl-8">
              {aside}
            </div>
          )}
        </div>

        {/* Mobile: main content below header */}
        {children && (
          <div className="pt-8 lg:hidden">
            {children}
          </div>
        )}

      </div>
    </main>
  )
}
