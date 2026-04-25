interface PageLayoutProps {
  title: string
  meta?: string        // eyebrow label — defaults to "Edinburgh SFF"
  description?: string
  children?: React.ReactNode
}

export function PageLayout({ title, meta = 'Edinburgh SFF', description, children }: PageLayoutProps) {
  return (
    <main className="flex-1 pb-28">
      <div className="max-w-2xl mx-auto px-5">

        <header className="pt-12 pb-8 border-b border-black/10">
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
              style={{ color: 'rgba(0,0,0,.6)', maxWidth: '36ch' }}
            >
              {description}
            </p>
          )}
        </header>

        {children && (
          <div className="pt-8">
            {children}
          </div>
        )}

      </div>
    </main>
  )
}
