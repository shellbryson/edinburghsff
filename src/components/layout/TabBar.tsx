'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/map',
    label: 'Map',
    icon: (active: boolean) => {
      const c = active ? 'var(--ink)' : 'rgba(0,0,0,0.4)'
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
            stroke={c} strokeWidth="1.6" strokeLinejoin="round"
            fill={active ? 'var(--esff-accent)' : 'none'}
          />
          <circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.6" fill="var(--paper)" />
        </svg>
      )
    },
  },
  {
    href: '/events',
    label: 'Events',
    icon: (active: boolean) => {
      const c = active ? 'var(--ink)' : 'rgba(0,0,0,0.4)'
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth="1.6" />
          <path d="M3 9h18" stroke={c} strokeWidth="1.6" />
          <path d="M8 3v4M16 3v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
          {active && <rect x="6" y="12" width="5" height="5" rx="1" fill="var(--esff-accent)" />}
        </svg>
      )
    },
  },
  {
    href: '/read',
    label: 'Read',
    icon: (active: boolean) => {
      const c = active ? 'var(--ink)' : 'rgba(0,0,0,0.4)'
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 5h7a3 3 0 013 3v12a2 2 0 00-2-2H3V5z"
            stroke={c} strokeWidth="1.6" strokeLinejoin="round"
            fill={active ? 'var(--esff-accent)' : 'none'}
          />
          <path
            d="M21 5h-7a3 3 0 00-3 3v12a2 2 0 012-2h8V5z"
            stroke={c} strokeWidth="1.6" strokeLinejoin="round"
          />
        </svg>
      )
    },
  },
  {
    href: '/about',
    label: 'About',
    icon: (active: boolean) => {
      const c = active ? 'var(--ink)' : 'rgba(0,0,0,0.4)'
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.6"
            fill={active ? 'var(--esff-accent)' : 'none'} />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
  },
]

export function TabBar() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/map') return null

  return (
    <div className="fixed bottom-3.5 left-3.5 right-3.5 z-50 flex justify-center pointer-events-none">
      <nav
        className="flex gap-1 rounded-full p-1.5 pointer-events-auto"
        style={{
          background: 'rgba(255,255,255,.78)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '.5px solid rgba(0,0,0,.08)',
          boxShadow: '0 12px 40px rgba(0,0,0,.12), 0 1px 0 rgba(255,255,255,.6) inset',
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-full transition-colors duration-200"
              style={{
                color: active ? 'var(--ink)' : 'rgba(0,0,0,.4)',
                background: active ? 'rgba(0,0,0,.05)' : 'transparent',
              }}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-semibold tracking-[.04em] uppercase">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
