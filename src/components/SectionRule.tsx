export function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <span
        className="text-[10px] font-bold tracking-[.14em] uppercase shrink-0"
        style={{ color: 'rgba(0,0,0,.5)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,.12)' }} />
    </div>
  )
}
