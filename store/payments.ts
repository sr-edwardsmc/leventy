import { type TEventWithRelations } from "@/types/events";
import { type FinancialInstitution } from "@/types/wompi";
import { type Ticketing } from "@prisma/client";
import { create } from "zustand";

type State = {
  acceptanceToken: string;
  pseFinancialInstitutions: FinancialInstitution[] | [];
  paymentStep: number;
  selectedEvent: TEventWithRelations | null;
  selectedPaymentMethod: string;
  selectedTicketing: Record<string, number> | null;
  purchaseTotalAmount: number;
  isProcessingPayment: boolean;
};

type Actions = {
  setPSEFinancialInstitutions: (
    pseFinancialInstitutions: State["pseFinancialInstitutions"]
  ) => void;
  setAcceptanceToken: (acceptanceToken: State["acceptanceToken"]) => void;
  setSelectedEvent: (selectedEvent: State["selectedEvent"]) => void;
  setSelectedPaymentMethod: (
    selectedPaymentMethod: State["selectedPaymentMethod"]
  ) => void;
  setSelectedTicketing: (selectedTicketing: State["selectedTicketing"]) => void;
  setPaymentStep: (paymentStep: State["paymentStep"]) => void;
  setPurchaseTotalAmount: (totalAmount: State["purchaseTotalAmount"]) => void;
  setIsProcessingPayment: (
    isProcessingPayment: State["isProcessingPayment"]
  ) => void;
  clearPaymentsStore: () => void;
};

const usePaymentsStore = create<State & Actions>((set) => ({
  pseFinancialInstitutions: [],
  setPSEFinancialInstitutions: (
    pseFinancialInstitutions: FinancialInstitution[]
  ) => set({ pseFinancialInstitutions: pseFinancialInstitutions }),
  acceptanceToken: "",
  setAcceptanceToken: (acceptanceToken: string) =>
    set({ acceptanceToken: acceptanceToken }),
  paymentStep: 1,
  setPaymentStep: (paymentStep: number) => set({ paymentStep: paymentStep }),
  selectedEvent: null,
  setSelectedEvent: (selectedEvent: TEventWithRelations | null) =>
    set({ selectedEvent: selectedEvent }),
  selectedPaymentMethod: "",
  setSelectedPaymentMethod: (selectedPaymentMethod: string) =>
    set({ selectedPaymentMethod: selectedPaymentMethod }),
  selectedTicketing: null,
  setSelectedTicketing: (selectedTicketing: Record<string, number> | null) =>
    set({ selectedTicketing: selectedTicketing }),
  purchaseTotalAmount: 0,
  setPurchaseTotalAmount: (totalAmount: number) =>
    set({ purchaseTotalAmount: totalAmount }),
  isProcessingPayment: false,
  setIsProcessingPayment: (isProcessingPayment: boolean) =>
    set({ isProcessingPayment: isProcessingPayment }),
  clearPaymentsStore: () =>
    set({
      acceptanceToken: "",
      paymentStep: 1,
      selectedEvent: null,
      selectedPaymentMethod: "",
      selectedTicketing: null,
      purchaseTotalAmount: 0,
      isProcessingPayment: false,
    }),
}));

export { usePaymentsStore };
