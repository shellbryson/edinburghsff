import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

const SECTIONS = [
  { href: '/admin/pages', label: 'Pages', description: 'Create and edit markdown content pages.' },
  { href: '/admin/locations', label: 'Locations', description: 'Manage map pins and venue details.' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="border border-black/10 rounded-xl p-5 hover:bg-black/2 transition-colors group"
          >
            <p className="font-semibold text-sm group-hover:underline">{label}</p>
            <p className="text-sm text-black/50 mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
