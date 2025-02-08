import { useEffect, useState } from "react";
import {
  Transaction as InternalTransaction,
  PaymentStatus,
  Ticketing,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import ShortUUID from "short-unique-id";

import { usePaymentsStore } from "@/store/payments";
import {
  createInternalTransaction,
  createTransaction,
  createTransactionSignature,
  getAcceptanceToken,
  getFinancialInstitutions,
  getRedirectURL,
  tokenizeCard,
} from "@/app/(landing)/events/actions";
import {
  ICreateTransactionInput,
  IFinancialInstitutionsResponse,
  ITokenizeCardInput,
  ITokenizeCardResponse,
  ITransactionResponse,
  PAYMENT_METHOD,
} from "@/types/wompi";
import { getTransactionDetails } from "@/app/transactions/status/actions";
import { useUserStore } from "@/store/userStore";
import { generateTicket } from "@/app/dashboard/(dashboard)/tickets/actions";
import { TEvent } from "@/types/events";

const uuid = new ShortUUID();

export const usePurchase = ({
  selectedEvent,
}: {
  selectedEvent: TEvent & { ticketing: Ticketing[] };
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const {
    acceptanceToken,
    pseFinancialInstitutions,
    setAcceptanceToken,
    setPSEFinancialInstitutions,
  } = usePaymentsStore();

  const { user: loggedUser } = useUserStore();

  useEffect(() => {
    // Fetch financial institutions
    if (!acceptanceToken) {
      getAccountAcceptanceToken();
    }
    if (pseFinancialInstitutions.length === 0) {
      getPSEAvailableInstitutions();
    }
  }, []);

  const getAccountAcceptanceToken = async () => {
    const response = await getAcceptanceToken();
    setAcceptanceToken(response.data.presigned_acceptance.acceptance_token);
  };

  const getPSEAvailableInstitutions = async () => {
    const response: IFinancialInstitutionsResponse =
      await getFinancialInstitutions();
    setPSEFinancialInstitutions(response.data);
  };

  const processCreditCardPayment = async ({
    cardData,
    amount,
    installments,
  }: {
    cardData: ITokenizeCardInput;
    amount: number;
    installments: number;
  }) => {
    setIsLoading(true);
    if (!loggedUser) return;
    const amountInCents: number = amount * 100;
    const transactionReference = await uuid.randomUUID(10);
    const transactionSignature = await createTransactionSignature({
      amount: amountInCents,
      currency: "COP",
      expirationTime: "",
      transactionReference: transactionReference,
    });

    try {
      const tokenizedCard: ITokenizeCardResponse = await tokenizeCard(cardData);

      const transactionPayload: ICreateTransactionInput = {
        reference: transactionReference,
        amount_in_cents: amountInCents,
        currency: "COP",
        payment_method: {
          type: PAYMENT_METHOD.CARD,
          token: tokenizedCard?.data.id,
          installments,
        },
        customer_email: loggedUser.email,
        acceptance_token: acceptanceToken,
        signature: transactionSignature,
      };

      const transactionResponse: ITransactionResponse = await createTransaction(
        transactionPayload
      );

      const internalTransaction: InternalTransaction =
        await createInternalTransaction({
          amount: amount,
          eventId: selectedEvent.id,
          provider: "WOMPI_CREDIT_CARD",
          providerTransactionId: transactionResponse.data.id,
          providerTransactionReference: transactionReference,
          userId: loggedUser.id,
          ticketingId: selectedEvent.ticketing[0].id,
          ticketId: null,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      router.replace(`/transactions/status?id=${transactionResponse.data.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const processPSEPayment = async ({
    amount,
    paymentMethod,
    customerEmail,
    customerData,
  }: any) => {
    if (!loggedUser) return;
    setIsLoading(true);
    const amountInCents: number = amount * 100;
    const transactionReference = await uuid.randomUUID(10);
    const transactionSignature = await createTransactionSignature({
      amount: amountInCents,
      currency: "COP",
      expirationTime: "",
      transactionReference: transactionReference,
    });

    try {
      const transactionPayload: ICreateTransactionInput = {
        reference: transactionReference,
        amount_in_cents: amountInCents,
        currency: "COP",
        payment_method: {
          ...paymentMethod,
          payment_description:
            "Pago de boleto de ingreso para el evento: " + selectedEvent.name,
        },
        customer_email: customerEmail,
        acceptance_token: acceptanceToken,
        customer_data: customerData,
        signature: transactionSignature,
        redirect_url: `${await getRedirectURL()}/transactions/status`,
      };

      const transactionResponse: ITransactionResponse = await createTransaction(
        transactionPayload
      );

      const internalTransaction: InternalTransaction =
        await createInternalTransaction({
          amount: amount,
          eventId: selectedEvent.id,
          provider: "WOMPI-PSE",
          providerTransactionId: transactionResponse.data.id,
          providerTransactionReference: transactionReference,
          userId: loggedUser?.id!,
          ticketingId: selectedEvent.ticketing[0].id,
          ticketId: null,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      // longPolling to check if there is a redirect_url within the transactionResponse.data.payment_method.extra object
      // if there is, redirect to that url
      await pollTransactionStatus(transactionResponse.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pollTransactionStatus = async (transactionId: string) => {
    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 12; // 1 minute

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response: ITransactionResponse = await getTransactionDetails(
        transactionId
      );

      if (response.data.payment_method.extra.async_payment_url) {
        window.location.href =
          response.data.payment_method.extra.async_payment_url;
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    setIsLoading(false);
    console.error("Transaction polling timed out");
  };

  return { isLoading, processCreditCardPayment, processPSEPayment };
};
