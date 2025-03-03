/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useTransaction } from "../../hooks/useTransaction";
import { Loader } from "@/components/Loader/Loader";
import { ApprovedTransactionModal } from "../ApprovedTransactionModal/ApprovedTransactionModal";
import { DeclinedTransactionModal } from "../DeclinedTransactionModal/DeclinedTransactionModal";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PaymentStatus } from "@prisma/client";

const TransactionStatusComponent = () => {
  const params = useSearchParams();

  const id = params.get("id");

  const { transaction, isLoading } = useTransaction({
    providerTransactionId: id as string,
  });

  if (isLoading) {
    return <Loader message="Validando transacción" />;
  }

  if (transaction?.status === PaymentStatus.APPROVED) {
    return <ApprovedTransactionModal />;
  }

  if (transaction?.status === PaymentStatus.DECLINED) {
    return (
      <DeclinedTransactionModal rejectedReason={transaction.status_message} />
    );
  }

  return <></>;
};

export const TransactionStatus = () => (
  <Suspense fallback={<Loader message="Cargando" />}>
    <TransactionStatusComponent />
  </Suspense>
);
