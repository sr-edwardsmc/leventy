"use server";
import { Suspense } from "react";
import PaymentStatus from "../components/PaymentStatus";

const PaymentStatusPage = () => {
  const createInvoicePdf = () => {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h2>Transaction Status Page</h2>
      <PaymentStatus />
    </Suspense>
  );
};

export default PaymentStatusPage;
