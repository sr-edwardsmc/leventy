import InputMask from "react-input-mask";

import { useCreditCardForm } from "./hooks/useCreditCardForm";
import { PAYMENT_METHOD } from "@/types/wompi";
import { usePaymentsStore } from "@/store/payments";
import { usePurchase } from "../PurchaseModal/hooks/usePurchase";

export const CreditCardForm = () => {
  const { purchaseTotalAmount } = usePaymentsStore();
  const { resolvePaymentProcess } = usePurchase();
  const { register, handleSubmit, errors, handlePaymentSubmit } =
    useCreditCardForm({
      orderAmount: purchaseTotalAmount,
      onSubmitPayment: resolvePaymentProcess,
    });

  return (
    <form className="w-full mb-4" onSubmit={handleSubmit(handlePaymentSubmit)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titulár de la tarjeta
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
            placeholder="John Doe"
            {...register("cardHolder", { required: true })}
          />
          {errors.cardHolder && (
            <span className="text-red">Este campo es requerido</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de la tarjeta
          </label>
          <InputMask
            mask="9999-9999-9999-9999"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
            placeholder="1234 5678 9012 3456"
            // make this only numbers
            {...register("cardNumber", {
              required: true,
              minLength: 4,
              pattern: {
                value: /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/,
                message: "Numero Inválido",
              },
            })}
          />
          {errors.cardNumber && (
            <span className="text-red">Este campo es requerido</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de vencimiento Mes/Año
            </label>
            <InputMask
              mask="99/99"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
              placeholder="MM/YY"
              {...register("expirationDate", {
                required: true,
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Invalid expiry date",
                },
              })}
            />
            {errors.expirationDate && (
              <span className="text-red">Este campo es requerido</span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between md:block">
            <label className="block text-sm font-medium text-gray-700">
              CVC
            </label>
            <InputMask
              mask="999"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
              placeholder="123"
              {...register("cvc", {
                required: true,
                pattern: /^[0-9]*$/,
                maxLength: 4,
              })}
            />
            {errors.cvc && (
              <span className="text-red">
                Este campo es requerido {errors.cvc.message?.toString()}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de cuotas
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
            {...register("installments", { required: true })}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-primary-blue text-white py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
        >
          Pagar
        </button>
      </div>
    </form>
  );
};
