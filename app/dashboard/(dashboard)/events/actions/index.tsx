"use server";
import db from "@/config/db";

import { TEventWithRelations, type TEvent } from "@/types/events";

export const createEvent = async ({
  eventData,
}: {
  eventData: TEvent;
}): Promise<TEvent> => {
  const response = await db.event.create({
    data: {
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      DJsLineUp: eventData.DJsLineUp,
      VJsLineUp: eventData.VJsLineUp,
      time: eventData.time,
      venue: eventData.venue,
      venueAddress: eventData.venueAddress,
      flyerUrl: eventData.flyerUrl,
    },
  });

  return response;
};

export const populateTickets = async () => {};

export const getEventsByCollectiveId = async (
  collectiveId: string
): Promise<TEventWithRelations[]> => {
  return await db.event.findMany({
    where: { collectiveId, date: { gte: new Date().toISOString() } },
    include: {
      ticketing: true,
    },
  });
};

export const getEvents = async (): Promise<TEvent[]> => {
  return await db.event.findMany();
};

export const getEventById = async (
  eventId: string
): Promise<TEventWithRelations | null> => {
  return await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      ticketing: true,
    },
  });
};

export const updateTicketingAvailability = async (
  ticketingId: string,
  isAvailable: boolean
) => {
  return await db.ticketing.update({
    where: {
      id: ticketingId,
    },
    data: {
      isAvailable,
    },
  });
};
