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
  const transaction = await db.transaction.findFirst({
    where: { providerTransactionId: providerTransactionId },
    include: { user: true },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const isAlreadyProcessed =
    transaction.status === PaymentStatus.APPROVED ||
    transaction.status === PaymentStatus.DECLINED;

  if (isAlreadyProcessed) return;

  const response = await generateTicket({
    eventId: transaction.eventId,
    name: transaction.user?.name!,
    lastName: transaction.user?.lastName!,
    email: transaction.user?.email!,
    phone: transaction.user?.phone!,
    city: transaction.user?.city!,
    gender: transaction.user?.gender!,
    idNumber: transaction.user?.idNumber!,
    birthday: transaction.user?.birthday!,
    generatedById: transaction.user?.id!,
    ticketingId: transaction.ticketingId!,
  });

  await db.transaction.update({
    where: { id: transaction.id },
    data: {
      status: PaymentStatus.APPROVED,
      ticketId: response?.data.id,
    },
  });
};
