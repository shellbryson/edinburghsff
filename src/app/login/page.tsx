import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Admin Login' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edinburgh SFF</h1>
          <p className="text-sm text-black/50 mt-1">Admin sign in</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
