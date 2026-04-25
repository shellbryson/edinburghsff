import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { fetchDiscordEvents } from '@/lib/discord'
import { Timestamp } from 'firebase-admin/firestore'

export async function POST() {
  const cookieStore = await cookies()
  if (!cookieStore.get('session')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    // Find existing Firestore doc by discordId
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
      // New — create with show:false so admin can review before publishing
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
      // Existing — update only Discord-owned fields, preserve admin edits to other fields
      const ref = existing.docs[0].ref
      const patch: Record<string, unknown> = {
        title: de.name,
        eventStart,
        updated: now,
      }
      if (eventEnd) patch.eventEnd = eventEnd
      if (location) patch.eventLocation = location
      // Overwrite summary only if Discord has one (admin may have written their own)
      if (de.description) patch.summary = de.description

      await ref.update(patch)
      updated++
    }
  }

  return NextResponse.json({ created, updated, total: active.length })
}
