"use client";
import { PublicHeader } from "@/components/Landing/Header";
import { useUserStore } from "@/store/userStore";
import { TUserWithRelations } from "@/types/users";
import { getSession } from "@/utils/auth";
import { useEffect } from "react";

function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  const checkIfUserIsLoggedIn = async () => {
    const session = await getSession();
    if (session && !user) {
      setUser(session as TUserWithRelations);
    }
  };

  return (
    <main>
      <PublicHeader />
      {children}
    </main>
  );
}

export default LandingLayout;
