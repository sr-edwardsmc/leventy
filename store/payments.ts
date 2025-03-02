import { TEvent, TEventWithRelations } from "@/types/events";
import { FinancialInstitution } from "@/types/wompi";
import { Ticketing } from "@prisma/client";
import { create } from "zustand";

type State = {
  acceptanceToken: string;
  pseFinancialInstitutions: FinancialInstitution[] | [];
  paymentStep: number;
  selectedEvent: TEventWithRelations | null;
  selectedPaymentMethod: string;
  selectedTicketing: Ticketing | null;
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
  setSelectedTicketing: (selectedTicketing: Ticketing | null) =>
    set({ selectedTicketing: selectedTicketing }),
}));

export { usePaymentsStore };
