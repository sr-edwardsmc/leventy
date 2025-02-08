import { ReactNode, createContext, useState } from "react";

interface TUser {
  name: string;
  email: string;
  id: number;
}

interface TUserContext {
  user: TUser;
  setUser: (user: TUser) => void;
  updateUser: (user: TUser) => void;
}

const UserContext = createContext<TUserContext | undefined>(undefined);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser>({
    name: "John Doe",
    email: "",
    id: 0,
  });

  const updateUser = (user: TUser) => {
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
