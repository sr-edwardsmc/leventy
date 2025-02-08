import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const useUser = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return userContext;
};
