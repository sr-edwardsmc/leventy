import db from "@/config/db";
import { TUserWithRelations } from "@/types/users";
import { Role, TicketStatus } from "@prisma/client";

export const getDashboardStatictics = async (user: TUserWithRelations) => {
  const generatedBy =
    user.role === Role.SYSTEM_ADMIN || user.role === Role.COLLECTIVE_ADMIN
      ? {}
      : { generatedById: user.id };
  const totalSoldTickets = await db.ticket.findMany({
    where: {
      status: {
        not: TicketStatus.ANNULLED,
      },
      event: {
        collectiveId: user.collectiveId,
      },
      ...generatedBy,
    },
    include: {
      ticketing: true,
    },
  });

  const totalEvents = await db.event.count({
    where: {
      collectiveId: user.collectiveId,
    },
  });

  const totalUsers = await db.user.count({
    where: {
      collectiveId: user.collectiveId,
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
