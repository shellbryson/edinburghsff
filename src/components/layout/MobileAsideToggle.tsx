'use client'

import { useState } from 'react'

interface Props {
  label: string
  children: React.ReactNode
}

export function MobileAsideToggle({ label, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 mt-5 group"
        aria-expanded={open}
      >
        <span
          className="text-[10px] font-bold tracking-[.14em] uppercase"
          style={{ color: 'rgba(0,0,0,.45)' }}
        >
          {label}
        </span>
        <span
          className="text-[10px] transition-transform duration-200"
          style={{
            color: 'rgba(0,0,0,.3)',
            display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-4 pb-2">
          {children}
        </div>
      )}
    </div>
  )
}
