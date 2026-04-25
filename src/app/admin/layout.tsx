import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { LogoutButton } from '@/components/admin/LogoutButton'

async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get('session')?.value ?? null
}

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/locations', label: 'Locations' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col bg-white text-(--ink)">
      <header className="border-b border-black/10 px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm tracking-tight">Edinburgh SFF</span>
          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label, exact }) => (
              <AdminNavLink key={href} href={href} exact={exact}>
                {label}
              </AdminNavLink>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 p-6 max-w-4xl w-full mx-auto">{children}</main>
    </div>
  )
}

// Server-side nav link — active state via pathname not available here,
// so we keep it simple; active highlighting is handled client-side if needed.
function AdminNavLink({
  href,
  exact,
  children,
}: {
  href: string
  exact?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-sm font-medium text-black/60 hover:text-black hover:bg-black/5 transition-colors"
    >
      {children}
    </Link>
  )
}
