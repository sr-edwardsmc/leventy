import { TEvent } from "@/types/events";
import { TUserWithRelations } from "@/types/users";
import { create } from "zustand";

type State = {
  user: TUserWithRelations | null;
  selectedEvent: TEvent | null;
};

type Actions = {
  setUser: (user: TUserWithRelations | null) => void;
  setSelectedEvent: (event: TEvent) => void;
};

const useUserStore = create<State & Actions>((set) => ({
  user: null,
  selectedEvent: null,
  setUser: (user) => set({ user }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
}));

export { useUserStore };
