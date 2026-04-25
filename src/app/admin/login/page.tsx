import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        {/* LoginForm client component goes here */}
      </div>
    </div>
  )
}
