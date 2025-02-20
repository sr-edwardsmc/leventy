import { EventDetail } from "../components/EventDetail";
import { getEventById } from "../actions";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const selectedEvent = await getEventById(eventId);
  return <EventDetail selectedEvent={selectedEvent!} />;
}
