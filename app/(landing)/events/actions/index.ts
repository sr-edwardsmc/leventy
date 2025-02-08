"use server";
import { Ticketing, Transaction } from "@prisma/client";
import db from "@/config/db";

import { WompiClient } from "@/services/wompiClient";
import {
  ICreateSignatureInput,
  ICreateTransactionInput,
  ITokenizeCardInput,
  ITokenizeCardResponse,
  ITransactionResponse,
} from "@/types/wompi";
import { TEvent } from "@/types/events";
import { MONTH_NAMES } from "@/utils/constants";

const wompiClient = new WompiClient();

export const getAllEventsOrdered = async () => {
  const events: (TEvent & { ticketing: Ticketing[] })[] =
    await db.event.findMany({
      include: {
        ticketing: {
          where: {
            startDate: { lte: new Date().toISOString() },
            endDate: { gte: new Date().toISOString() },
          },
        },
      },
    });

  const orderedEventsByMonth: {
    month: string;
    events: (TEvent & { ticketing: Ticketing[] })[];
  }[] = [];

  for (let i = 1; i <= 12; i++) {
    const eventsByMonth = events.filter(
      (event) => new Date(event.date).getMonth() === i
    );
    if (eventsByMonth.length > 0) {
      orderedEventsByMonth.push({
        month: MONTH_NAMES[i + 1],
        events: eventsByMonth,
      });
    }
  }

  return orderedEventsByMonth;
};

export const getFinancialInstitutions = async () => {
  const response = await wompiClient.getPSEFinancialInstitutions();
  return response;
};

export const getAcceptanceToken = async () => {
  const response = await wompiClient.getAcceptanceToken();
  return response;
};

export const getRedirectURL = async (): Promise<string> => {
  const redirectURL = wompiClient.getRedirectURL();
  return redirectURL;
};

export const tokenizeCard = async (
  data: ITokenizeCardInput
): Promise<ITokenizeCardResponse> => {
  const response = await wompiClient.tokenizeCard(data);
  return response;
};

export const createTransactionSignature = async (
  args: ICreateSignatureInput
) => {
  const response = await wompiClient.createSignature(args);
  return response;
};

export const createTransaction = async (
  transactionPayload: ICreateTransactionInput
): Promise<ITransactionResponse> => {
  const response = await wompiClient.createTransaction(transactionPayload);
  return response;
};

export const createInternalTransaction = async (
  transactionPayload: Omit<Transaction, "id">
) => {
  const createdTransaction = await db.transaction.create({
    data: transactionPayload,
  });
  return createdTransaction;
};
