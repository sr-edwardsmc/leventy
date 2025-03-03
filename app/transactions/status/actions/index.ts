"use server";

import { WompiClient } from "@/services/wompiClient";
import db from "@/config/db";
import { PaymentStatus } from "@prisma/client";
import { generateTicket } from "@/app/dashboard/(dashboard)/tickets/actions";
const wompiClient = new WompiClient();

export const getTransactionDetails = async (transactionId: string) => {
  const response = await wompiClient.getTransactionById(transactionId);
  return response;
};

export const processApprovedTransaction = async (
  providerTransactionId: string
) => {
  const transactions = await db.transaction.findMany({
    where: { providerTransactionId: providerTransactionId },
    include: { user: true },
  });

  const ticketings = await db.ticketing.findMany({
    where: { eventId: transactions[0].eventId },
  });

  if (!transactions.length) {
    throw new Error("Transaction not found");
  }

  if (transactions[0].status === PaymentStatus.APPROVED) {
    throw new Error("Transaction already processed");
  }

  for (const transaction of transactions) {
    const response = await generateTicket({
      eventId: transaction.eventId,
      fullName: transaction.user?.name! + " " + transaction.user?.lastName!,
      email: transaction.user?.email!,
      phone: transaction.user?.phone!,
      city: transaction.user?.city!,
      gender: transaction.user?.gender!,
      idNumber: transaction.user?.idNumber!,
      birthday: transaction.user?.birthday!,
      generatedById: transaction.user?.id!,
      ticketingId: transaction.ticketingId!,
      ticketingName: ticketings.find(
        (ticketing) => ticketing.id === transaction.ticketingId
      )?.name!,
    });

    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: PaymentStatus.APPROVED,
        ticketId: response?.data.id,
      },
    });
  }
};
