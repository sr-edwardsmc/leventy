"use server";

import { ITransactionResponse } from "@/types/wompi";

export const getTransactionDetails = async (
  transactionId: string
): Promise<ITransactionResponse> => {
  const API_URL = process.env.WOMPI_API_URL;
  const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
    method: "GET",
  });
  return await response.json();
};
