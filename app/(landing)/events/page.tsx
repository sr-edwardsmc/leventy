"use server";

import { revalidatePath } from "next/cache";
import { getAllEventsOrdered } from "./actions";
import { EventsList } from "./components/EventsList/EventsList";

async function EventsPage() {
  const allEvents = await getAllEventsOrdered();
  revalidatePath("/events");

  return (
    <>
      <EventsList eventsList={allEvents} />
    </>
  );
}

export default EventsPage;
