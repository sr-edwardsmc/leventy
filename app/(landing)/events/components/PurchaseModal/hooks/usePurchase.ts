import { useEffect } from "react";
import { PaymentStatus } from "@prisma/client";
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
  type ICreateTransactionInput,
  type IFinancialInstitutionsResponse,
  type ITokenizeCardInput,
  type ITokenizeCardResponse,
  type ITransactionResponse,
  PAYMENT_METHOD,
} from "@/types/wompi";
import { getTransactionDetails } from "@/app/transactions/status/actions";
import { useUserStore } from "@/store/userStore";
import { CURRENCY, PAYMENT_PROVIDER } from "@/types";

const uuid = new ShortUUID();

export const usePurchase = () => {
  const router = useRouter();

  const {
    acceptanceToken,
    pseFinancialInstitutions,
    setAcceptanceToken,
    setPSEFinancialInstitutions,
    selectedEvent,
    selectedTicketing,
    setIsProcessingPayment,
    purchaseTotalAmount,
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

  const resolvePaymentProcess = async (
    paymentMethod: PAYMENT_METHOD,
    data: any
  ) => {
    setIsProcessingPayment(true);
    const paymentResolver = {
      ["CARD"]: async () => {
        await processCreditCardPayment({
          cardData: {
            card_holder: data.cardHolder,
            number: data.cardNumber,
            cvc: data.cvc,
            exp_month: data.expirationDate.split("/")[0],
            exp_year: data.expirationDate.split("/")[1],
          },
          amount: data.amount,
          installments: data.installments,
        });
      },
      ["NEQUI"]: () => {},
      ["DAVIPLATA"]: () => {},
      ["PSE"]: async () => {
        await processPSEPayment({
          amount: data.amount,
          customerEmail: loggedUser?.email,
          paymentMethod: {
            type: PAYMENT_METHOD.PSE,
            user_type: data.personType,
            user_legal_id_type: loggedUser?.idType,
            user_legal_id: loggedUser?.idNumber,
            financial_institution_code: data.financialInstitutionId,
            payment_description: data.paymentDescription,
          },
          customerData: {
            full_name: loggedUser?.name,
            phone_number: loggedUser?.phone,
          },
        });
      },
    };
    await paymentResolver[paymentMethod]();
    setIsProcessingPayment(false);
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
    setIsProcessingPayment(true);
    if (!loggedUser) return;
    const amountInCents: number = amount * 100;
    const transactionReference = await uuid.randomUUID(10);
    const transactionSignature = await createTransactionSignature({
      amount: amountInCents,
      currency: CURRENCY.COP,
      expirationTime: "",
      transactionReference: transactionReference,
    });

    try {
      const tokenizedCard: ITokenizeCardResponse = await tokenizeCard(cardData);

      const transactionPayload: ICreateTransactionInput = {
        reference: transactionReference,
        amount_in_cents: amountInCents,
        currency: CURRENCY.COP,
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

      await forwardCreateInternalTransactions(
        PAYMENT_PROVIDER.WOMPI_CARD,
        transactionResponse.data.id,
        transactionReference
      );

      router.replace(`/transactions/status?id=${transactionResponse.data.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const processPSEPayment = async ({
    amount,
    paymentMethod,
    customerEmail,
    customerData,
  }: any) => {
    if (!loggedUser) return;
    setIsProcessingPayment(true);
    const amountInCents: number = amount * 100;
    const transactionReference = await uuid.randomUUID(10);
    const transactionSignature = await createTransactionSignature({
      amount: amountInCents,
      currency: CURRENCY.COP,
      expirationTime: "",
      transactionReference: transactionReference,
    });

    try {
      const transactionPayload: ICreateTransactionInput = {
        reference: transactionReference,
        amount_in_cents: amountInCents,
        currency: CURRENCY.COP,
        payment_method: {
          ...paymentMethod,
          payment_description:
            "Pago de boleto de ingreso para el evento: " + selectedEvent!.name,
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

      await forwardCreateInternalTransactions(
        PAYMENT_PROVIDER.WOMPI_PSE,
        transactionResponse.data.id,
        transactionReference
      );

      // longPolling to check if there is a redirect_url within the transactionResponse.data.payment_method.extra object
      // if there is, redirect to that url
      await pollTransactionStatus(transactionResponse.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingPayment(false);
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

    setIsProcessingPayment(false);
    console.error("Transaction polling timed out");
  };

  // @Documentation
  // This method is responsible for creating as many tickets
  // as the user purchased in the Transactions table
  // Including different ticketing types and quantities.
  // Will be used to generate tickets for massive purchases
  // Checking for all the records in the Transactions database.
  const forwardCreateInternalTransactions = async (
    provider: PAYMENT_PROVIDER,
    providerTransactionId: string,
    providerTransactionReference: string
  ) => {
    const currentTransactions = { ...selectedTicketing };
    for (const [ticketingId, amount] of Object.entries(currentTransactions)) {
      for (let i = 0; i < amount; i++) {
        await createInternalTransaction({
          amount: purchaseTotalAmount,
          eventId: selectedEvent!.id,
          provider,
          providerTransactionId,
          providerTransactionReference,
          userId: loggedUser?.id!,
          ticketingId: ticketingId,
          ticketId: null,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  };

  return {
    processCreditCardPayment,
    processPSEPayment,
    resolvePaymentProcess,
  };
};
