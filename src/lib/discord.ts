export interface DiscordScheduledEvent {
  id: string
  name: string
  description?: string
  scheduled_start_time: string   // ISO 8601
  scheduled_end_time?: string
  entity_metadata?: { location?: string }
  entity_type: number            // 1 = stage, 2 = voice, 3 = external
  status: number                 // 1 = scheduled, 2 = active, 3 = completed, 4 = cancelled
  image?: string                 // hash — build URL with cdn.discordapp.com
}

export async function fetchDiscordEvents(guildId: string, token: string): Promise<DiscordScheduledEvent[]> {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/scheduled-events`,
    {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: 0 },
    }
  )
  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}
