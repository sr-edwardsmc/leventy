import { usePaymentsStore } from "@/store/payments";
import { PAYMENT_METHOD } from "@/types/wompi";
import { useForm } from "react-hook-form";

interface PSEForm {
  financialInstitutionId: string;
  personType: string;
  cellphone: string;
}

interface UsePSEFormInput {
  orderAmount: number;
  onSubmitPayment: (paymentMethod: PAYMENT_METHOD, data: any) => void;
}

export const usePSEForm = ({
  orderAmount,
  onSubmitPayment,
}: UsePSEFormInput) => {
  const { pseFinancialInstitutions } = usePaymentsStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PSEForm>();

  const handleFormSubmit = (data: PSEForm) => {
    onSubmitPayment(PAYMENT_METHOD.PSE, {
      ...data,
      amount: orderAmount,
    });
  };

  return {
    handleSubmit,
    handleFormSubmit,
    register,
    errors,
    pseFinancialInstitutions,
  };
};
