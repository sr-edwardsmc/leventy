"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

import { PurchaseModal } from "../PurchaseModal/PurchaseModal";
import { Ticketing } from "@prisma/client";
import { TEvent } from "@/types/events";

interface EventsListProps {
  eventsList: {
    month: string;
    events: (TEvent & { ticketing: Ticketing[] })[];
  }[];
}

export const EventsList = ({ eventsList }: EventsListProps) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<
    (TEvent & { ticketing: Ticketing[] }) | null
  >(null);

  const handlePurchase = async (
    selectedEvent: TEvent & { ticketing: Ticketing[] }
  ) => {
    setSelectedEvent(selectedEvent);
    setShowPurchaseModal(true);
  };

  return (
    <>
      <section className="w-full h-full flex flex-col p-8 gap-8">
        {eventsList.map((eventGroup) => (
          <motion.section key={eventGroup.month} className="mb-10">
            <motion.h2 className="text-2xl text-black">
              {eventGroup.month}
            </motion.h2>
            <div className="w-[20%] h-[1px] bg-black mt-2 mb-4"></div>
            {eventGroup.events.map((event) => (
              <motion.section
                key={event.id}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  animation: "fadeIn",
                  animationDelay: "2.5",
                }}
                whileHover={{ scale: 1.01 }}
                className="flex-col h-[fit-content] mb-4 flex md:flex-row items-start md:h-[200px] justify-start rounded-lg border border-white p-2 shadow-4 gap-2 bg-white relative cursor-pointer"
              >
                <figure className="w-full h-[400px] md:w-[160px] relative md:h-[100%]">
                  <Image
                    src={"/" + event.flyerUrl}
                    alt="flyer"
                    layout="fill"
                    objectPosition="cover"
                  />
                </figure>
                <section className="h-[100%] px-2 flex flex-col justify-between items-stretch">
                  <h1 className="text-2xl my-2 md:my-0 font-bold">
                    {event.name}
                  </h1>
                  <h2 className="font-bold">
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })}
                  </h2>
                  <h2 className="text-md my-1 md:my-0">
                    Lugar: {event.venue} - {event.venueAddress}
                  </h2>
                  <p className="text-md my-1 md:my-0">{event.description}</p>
                  <p className="text-md">
                    Artistas: {event.DJsLineUp.map((dj) => dj).join(", ")}
                  </p>
                  <p className="text-md">
                    Visuales: {event.VJsLineUp.map((v) => v).join(", ")}
                  </p>
                  {event.isSoldOut ? (
                    <p className="text-md flex gap-4">
                      Tickets:{" "}
                      <span className="text-red font-bold">SOLD OUT!</span>
                    </p>
                  ) : (
                    <p className="text-md font-bold my-1 md:my-0">
                      Tickets:{" "}
                      <span className="font-bold">
                        {event.ticketing
                          .map(
                            (t) =>
                              t.name +
                              " - $" +
                              Intl.NumberFormat("es-CO").format(t.price)
                          )
                          .join(" /  ")}
                      </span>
                    </p>
                  )}
                </section>
                {!event.isSoldOut && (
                  <section className="w-full md:w-[200px] flex md:absolute bottom-1 right-4 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-full flex items-center justify-center gap-2 p-2 text-md my-4 rounded-lg bg-white border hover:bg-primary hover:text-white border-primary text-primary"
                      onClick={async () => {
                        handlePurchase(event);
                      }}
                    >
                      <span className="icon-[tabler--ticket] text-2xl"></span>
                      Comprar
                    </motion.button>
                  </section>
                )}
              </motion.section>
            ))}
          </motion.section>
        ))}

        {showPurchaseModal && selectedEvent && (
          <PurchaseModal
            selectedEvent={selectedEvent}
            handleClose={() => setShowPurchaseModal(false)}
          />
        )}
      </section>
    </>
  );
};
