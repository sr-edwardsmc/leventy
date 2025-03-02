import { PAYMENT_METHOD } from "@/types/wompi";
import React from "react";
import { usePSEForm } from "./hooks/userPSEForm";

interface PSEFormProps {
  onSubmitPayment: (paymentMethod: PAYMENT_METHOD, data: any) => void;
  orderAmount: number;
}

const PSEForm: React.FC<PSEFormProps> = ({ orderAmount, onSubmitPayment }) => {
  const {
    handleSubmit,
    register,
    errors,
    pseFinancialInstitutions,
    handleFormSubmit,
  } = usePSEForm({ orderAmount, onSubmitPayment });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6">
      <div className="flex flex-col mb-2">
        <label htmlFor="bank" className="mb-1 font-medium text-sm">
          Entidad bancaria:{" "}
          {errors.financialInstitutionId && (
            <span className="text-red">- Este campo es obligatorio</span>
          )}
        </label>
        <select
          id="financialInstitutionId"
          {...register("financialInstitutionId", {
            required: true,
          })}
          className="border p-2 rounded"
        >
          <option value="">Selecciona tu banco</option>
          {pseFinancialInstitutions.map((bank) => (
            <option
              key={bank.financial_institution_code}
              value={bank.financial_institution_code}
            >
              {bank.financial_institution_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-start items-center gap-2 mb-3">
        <label className="mb-1 font-medium text-md">Tipo de persona: </label>
        <div className="flex space-x-2">
          <label className="flex items-center text-sm">
            <input
              type="radio"
              value={0}
              {...register("personType", {
                required: "Person type is required",
              })}
              className="mr-2"
            />
            Natural
          </label>
          <label className="flex items-center text-sm">
            <input
              type="radio"
              value={1}
              {...register("personType", {
                required: "Person type is required",
              })}
              className="mr-2"
            />
            Juridica
          </label>
        </div>
      </div>

      <div className="flex flex-col mb-2">
        <label htmlFor="cellphone" className="mb-1 font-medium text-sm">
          Número Celular:
        </label>
        <input
          type="tel"
          id="cellphone"
          {...register("cellphone", {
            required: "Cellphone is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid cellphone number",
            },
          })}
          className="border p-2 rounded"
        />
        {errors.cellphone && (
          <span className="text-red-500">
            {errors.cellphone.message as String}
          </span>
        )}
      </div>

      <div className="w-full mb-2">
        <button
          type="submit"
          className="block w-full rounded border border-stroke bg-primary p-3 text-center font-medium text-white transition"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};

export default PSEForm;
