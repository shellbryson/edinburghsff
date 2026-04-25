import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Auth check runs server-side via session cookie set at login
async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get('session')?.value ?? null
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <span className="font-semibold text-sm">Edinburgh SFF — Admin</span>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
