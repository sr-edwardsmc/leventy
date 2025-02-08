"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "../components/DashboardHeader/index";
import dynamic from "next/dynamic";
import { useUserStore } from "@/store/userStore";
import { getSession } from "@/utils/auth";
import { TUserWithRelations } from "@/types/users";

const Sidebar = dynamic(() => import("../components/Sidebar/index"), {
  ssr: false,
});

const PrivateLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  //
  const checkIfUserIsLoggedIn = async () => {
    const session = await getSession();
    if (session && !user) {
      setUser(session as TUserWithRelations);
    }
  };

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="w-full relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default PrivateLayout;
