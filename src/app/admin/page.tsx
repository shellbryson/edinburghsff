import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Select a section from the sidebar.</p>
    </div>
  )
}
