"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePaymentStatus } from "../hooks/usePaymentsStatus";

function PaymentStatus() {
  const queryParams = useSearchParams();
  const transactionId = queryParams.get("id") || "";

  const { status } = usePaymentStatus({ transactionId });

  return (
    <>
      <p>
        Payment id is: {transactionId}, status: {status}{" "}
      </p>
    </>
  );
}

export default PaymentStatus;
