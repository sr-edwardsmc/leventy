"use client";
import { useRouter } from "next/navigation";

import ImageCard from "@/components/Cards/ImageCard";
import { useUserStore } from "@/store/userStore";
import { type TEvent } from "@/types/events";

const EventsList = ({ events }: { events: TEvent[] }) => {
  const router = useRouter();
  const { setSelectedEvent } = useUserStore();

  const handleEventSelected = (event: TEvent) => {
    setSelectedEvent(event);
    router.push(`/dashboard/events/${event.id}`);
  };

  return (
    <div>
      {events.map((event) => (
        <ImageCard
          key={event.id}
          cardImageSrc={event.flyerUrl}
          cardTitle={event.name}
          cardContent={event.description}
          handleClick={() => handleEventSelected(event)}
        />
      ))}
    </div>
  );
};

export default EventsList;
