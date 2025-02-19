import { EventDetail } from "../components/EventDetail";
import { getEventById } from "../actions";
import { useRouter } from "next/router";

async function EventsPage(params: Promise<{ eventId: string }>) {
  const selectedEventId = (await params).eventId;
  console.log(selectedEventId);
  const selectedEvent = await getEventById("eventId");

  return <EventDetail selectedEvent={selectedEvent!} />;
}

export { EventsPage as default };
