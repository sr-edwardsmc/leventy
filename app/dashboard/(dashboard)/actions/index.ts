import db from "@/config/db";
import { TicketStatus } from "@prisma/client";

export const getDashboardStatictics = async (collectiveId: string) => {
  const totalSoldTickets = await db.ticket.findMany({
    where: {
      status: {
        not: TicketStatus.ANNULLED,
      },
      event: {
        collectiveId: collectiveId,
      },
    },
    include: {
      ticketing: true,
    },
  });

  const totalEvents = await db.event.count({
    where: {
      collectiveId: collectiveId,
    },
  });

  const totalUsers = await db.user.count({
    where: {
      collectiveId,
    },
  });

  // Query to get the total money made by the collective
  let totalMoney = 0;
  totalSoldTickets.forEach((ticket) => {
    totalMoney += ticket.ticketing.price;
  });

  return {
    totalSoldTickets: totalSoldTickets.length ? totalSoldTickets.length : 0,
    totalEvents,
    totalUsers,
    totalMoney,
  };
};
