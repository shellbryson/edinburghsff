interface PageLayoutProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <main className="flex-1 px-5 pt-14 pb-28 max-w-2xl mx-auto w-full">
      <p
        className="text-[10px] font-semibold tracking-[.12em] uppercase mb-3"
        style={{ color: 'rgba(0,0,0,.5)', fontFamily: 'var(--font-body)' }}
      >
        Edinburgh SFF
      </p>

      <h1
        className="text-[42px] leading-[.95] tracking-[-0.03em] font-bold mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}<span style={{ color: 'var(--esff-accent)' }}>.</span>
      </h1>

      {description && (
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'rgba(0,0,0,.6)', maxWidth: '40ch' }}
        >
          {description}
        </p>
      )}

      {children && (
        <div className={description ? '' : 'mt-8'}>
          {children}
        </div>
      )}
    </main>
  )
}
