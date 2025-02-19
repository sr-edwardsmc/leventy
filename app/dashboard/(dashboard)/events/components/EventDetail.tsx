import { useUserStore } from "@/store/userStore";
import { TEvent } from "@/types/events";
import Image from "next/image";

interface EventDetailProps {
  selectedEvent: TEvent;
}

function EventDetail(props: EventDetailProps) {
  const { selectedEvent } = props;

  return (
    <section className="w-90%">
      <h2>Evento</h2>
      <article>
        <Image
          src={selectedEvent.flyerUrl}
          alt={selectedEvent.name}
          className="w-full rounded-t-lg"
          layout="responsive"
          width={700}
          height={475}
        />
        <p>{selectedEvent.name}</p>
        <p>{selectedEvent.description}</p>
      </article>
    </section>
  );
}

export { EventDetail };
