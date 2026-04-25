'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    await fetch('/api/session', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-black/50 hover:text-black transition-colors"
    >
      Sign out
    </button>
  )
}
