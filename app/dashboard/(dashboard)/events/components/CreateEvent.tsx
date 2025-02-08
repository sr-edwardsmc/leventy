"use client";
import { type TEvent } from "@/types/events";
import { createEvent } from "../actions";

const eventData: TEvent = {
  id: "",
  name: "New Event",
  description: "This is a new event",
  date: new Date(),
  DJsLineUp: ["DJ1", "DJ2"],
  VJsLineUp: ["VJ1", "VJ2"],
  time: "20:00",
  venue: "Venue",
  venueAddress: "Venue Address",
  flyerUrl: "Flyer URL",
  collectiveId: "co001",
  isSoldOut: false,
};
export const CreateEvent = () => {
  return (
    <button
      onClick={async () => {
        console.log("Creating event...");
        const response = await createEvent({ eventData });
        console.log(response, "Event created");
      }}
    >
      Create Event
    </button>
  );
};

export default CreateEvent;
