import { Event, Raver, Ticket, Ticketing, TicketStatus } from "@prisma/client";
import { TUser } from "./users";

export type TEvent = Event;

export type TEventWithRelations = Event & {
  ticketing: Ticketing[];
};

export type TRaver = Raver;

export type TTicket = Ticket & {
  raver: TRaver | null;
  generatedBy: TUser;
  ticketing: Ticketing;
};

export interface ITicketTableColumns {
  id: string;
  status: TicketStatus;
  name: string;
  email: string;
  identification: string;
}
