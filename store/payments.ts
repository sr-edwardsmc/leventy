import { FinancialInstitution } from "@/types/wompi";
import { create } from "zustand";

type State = {
  acceptanceToken: string;
  pseFinancialInstitutions: FinancialInstitution[] | [];
};

type Actions = {
  setPSEFinancialInstitutions: (
    pseFinancialInstitutions: State["pseFinancialInstitutions"]
  ) => void;
  setAcceptanceToken: (acceptanceToken: State["acceptanceToken"]) => void;
};

const usePaymentsStore = create<State & Actions>((set) => ({
  pseFinancialInstitutions: [],
  setPSEFinancialInstitutions: (
    pseFinancialInstitutions: FinancialInstitution[]
  ) => set({ pseFinancialInstitutions: pseFinancialInstitutions }),
  acceptanceToken: "",
  setAcceptanceToken: (acceptanceToken: string) =>
    set({ acceptanceToken: acceptanceToken }),
}));

export { usePaymentsStore };
