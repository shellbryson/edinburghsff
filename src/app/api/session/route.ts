import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export async function POST(request: Request) {
  const { token } = await request.json()
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })
  const cookieStore = await cookies()
  cookieStore.set('session', token, SESSION_OPTS)
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return NextResponse.json({ ok: true })
}
