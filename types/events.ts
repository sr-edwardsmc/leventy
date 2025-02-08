import { Event, Ticket, Ticketing, TicketStatus } from "@prisma/client";
import { TUser } from "./users";

export type TEvent = Event;

export type TTicket = Ticket & {
  user: TUser;
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
