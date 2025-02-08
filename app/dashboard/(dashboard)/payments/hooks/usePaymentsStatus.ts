/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getTransactionDetails } from "../actions";

interface UsePaymentStatusProps {
  transactionId: string;
}

const usePaymentStatus = (props: UsePaymentStatusProps) => {
  const { transactionId } = props;
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async () => {
      await validateTransactionStatus();
    };
  }, [transactionId]);

  const validateTransactionStatus = async () => {
    const response = await getTransactionDetails(transactionId);
    setStatus(response.data.status);
  };

  const confirmTransaction = async () => {
    // Confirm transaction
  };

  return {
    status,
  };
};

export { usePaymentStatus };
