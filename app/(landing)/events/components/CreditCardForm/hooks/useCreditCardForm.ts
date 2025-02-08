import { PAYMENT_METHOD } from "@/types/wompi";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface UseCreditCardInput {
  orderAmount: number;
  onSubmitPayment: (paymentMethod: PAYMENT_METHOD, data: any) => void;
}

export const useCreditCardForm = ({
  orderAmount,
  onSubmitPayment,
}: UseCreditCardInput) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handlePaymentSubmit = (data: any) => {
    const cardNumber = data.cardNumber.replace(/-/g, "");
    onSubmitPayment(PAYMENT_METHOD.CARD, {
      ...data,
      amount: orderAmount,
      cardNumber,
    });
  };

  return {
    register,
    errors,
    handleSubmit,
    isSubmitting,
    handlePaymentSubmit,
  };
};
