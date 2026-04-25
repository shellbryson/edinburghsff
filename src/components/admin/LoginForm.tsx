'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const token = await credential.user.getIdToken()
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error('Session error')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
        style={{ background: 'var(--ink)', color: 'var(--paper)' }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
