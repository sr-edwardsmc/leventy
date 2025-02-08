import { useEffect, useState } from "react";
import { PaymentStatus } from "@prisma/client";

import { ITransactionResponse } from "@/types/wompi";
import { getTransactionDetails, processApprovedTransaction } from "../actions";

export const useTransaction = ({
  providerTransactionId,
}: {
  providerTransactionId: string;
}) => {
  const [transaction, setTransaction] = useState<
    ITransactionResponse["data"] | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!providerTransactionId) return;
    longPollingForTransaction();
  }, [providerTransactionId]);

  useEffect(() => {
    if (transaction?.status === PaymentStatus.APPROVED) {
      processSuccessTransaction();
    }
  }, [transaction?.status]);

  const longPollingForTransaction = async () => {
    setIsLoading(true);
    const interval = setInterval(async () => {
      const transactionResponse = await getTransactionDetails(
        providerTransactionId
      );
      if (transactionResponse.data.status !== "PENDING") {
        setTransaction(transactionResponse.data);
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 1000);
  };

  const processSuccessTransaction = async () => {
    await processApprovedTransaction(providerTransactionId);
  };

  return { isLoading, transaction };
};
