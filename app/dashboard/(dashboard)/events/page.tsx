import { getSession } from "@/utils/auth";
import { getEventsByCollectiveId } from "./actions";
import EventsList from "./components/EventsList";
import { TUser } from "@/types/users";

async function EventsPage() {
  const authenticatedUser = (await getSession()) as TUser;
  const events = await getEventsByCollectiveId(authenticatedUser.collectiveId!);

  return (
    <section className="w-full flex gap-4">
      <EventsList events={events} />
    </section>
  );
}

export default EventsPage;
