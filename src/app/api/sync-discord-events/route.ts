import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { fetchDiscordEvents } from '@/lib/discord'
import { Timestamp } from 'firebase-admin/firestore'

async function runSync() {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    return NextResponse.json(
      { error: 'DISCORD_BOT_TOKEN and DISCORD_GUILD_ID must be set in environment' },
      { status: 500 }
    )
  }

  const discordEvents = await fetchDiscordEvents(guildId, token)

  // Only sync scheduled or active events (status 1 or 2); skip completed/cancelled
  const active = discordEvents.filter(e => e.status === 1 || e.status === 2)

  let created = 0
  let updated = 0

  for (const de of active) {
    const existing = await adminDb
      .collection('events')
      .where('discordId', '==', de.id)
      .limit(1)
      .get()

    const eventStart = Timestamp.fromDate(new Date(de.scheduled_start_time))
    const eventEnd = de.scheduled_end_time
      ? Timestamp.fromDate(new Date(de.scheduled_end_time))
      : null
    const location = de.entity_metadata?.location ?? undefined
    const now = Timestamp.now()

    if (existing.empty) {
      const payload: Record<string, unknown> = {
        discordId: de.id,
        title: de.name,
        summary: de.description ?? '',
        eventStart,
        eventIsAllDay: false,
        eventIsFeatured: false,
        eventIsDigital: false,
        show: false,
        created: now,
        updated: now,
      }
      if (eventEnd) payload.eventEnd = eventEnd
      if (location) payload.eventLocation = location

      await adminDb.collection('events').add(payload)
      created++
    } else {
      const ref = existing.docs[0].ref
      const patch: Record<string, unknown> = {
        title: de.name,
        eventStart,
        updated: now,
      }
      if (eventEnd) patch.eventEnd = eventEnd
      if (location) patch.eventLocation = location
      if (de.description) patch.summary = de.description

      await ref.update(patch)
      updated++
    }
  }

  return NextResponse.json({ created, updated, total: active.length })
}

// Called manually from the admin UI
export async function POST() {
  const cookieStore = await cookies()
  if (!cookieStore.get('session')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runSync()
}

// Called by Vercel Cron
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')

  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return runSync()
}
