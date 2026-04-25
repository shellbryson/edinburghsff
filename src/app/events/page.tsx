import type { Metadata } from 'next'
import { getPublicEventsServer } from '@/lib/firebase/events-server'
import { PageLayout } from '@/components/layout/PageLayout'
import { EventsCalendar } from '@/components/EventsCalendar'
import { EventsList } from '@/components/EventsList'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: "Readings, workshops, open-mics and community gatherings for Edinburgh's SFF writers.",
}

export default async function EventsPage() {
  const all = await getPublicEventsServer()
  const calendarEvents = all.map(e => ({ start: e.eventStart, end: e.eventEnd }))

  return (
    <PageLayout
      meta="Upcoming"
      title="Events"
      description="Readings, workshops, open mics — across the city."
      asideLabel="Calendar"
      aside={<EventsCalendar events={calendarEvents} />}
    >
      <EventsList events={all} />
    </PageLayout>
  )
}
