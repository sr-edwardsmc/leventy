"use client";
import { Birthstone } from "next/font/google";
import { usePathname } from "next/navigation";

import DropdownUser from "@/components/Dropdown/DropdownUser";
import { useUserStore } from "@/store/userStore";

const birthstone = Birthstone({
  weight: ["400"],
  subsets: ["latin"],
});

export const PublicHeader = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  return (
    <header className="h-[60px] w-full md:h-[80px] px-4 py-4 md:px-8 md:py-4 flex justify-between items-center bg-white shadow-2 sticky top-0 z-[100]">
      <nav className="hidden md:block">
        <a
          href="/events"
          className={`text-primary border-b-transparent border-b-2 hover:border-primary flex items-end gap-2 pb-1 ${
            pathname === "/events" ? "!border-b-primary" : ""
          }`}
        >
          <span className="icon-[icon-park--calendar] text-2xl"></span>
          Eventos
        </a>
      </nav>
      <h1
        className={
          "mt-[-10px] absolute right-[40%] md:right-[45%] text-6xl font-bold text-primary ml-4 cursor-pointer " +
          birthstone.className
        }
      >
        Leventy
      </h1>
      {user && <DropdownUser />}
      {!user && (
        <nav className="md:flex gap-10 hidden">
          <a
            href="/login"
            className={`text-primary border-b-transparent border-b-2 hover:border-primary flex items-center gap-2 pb-1 ${
              pathname === "/login" ? "!border-b-primary" : ""
            }`}
          >
            <span className="icon-[hugeicons--password-validation] text-2xl"></span>
            Ingresar
          </a>
          <div className="w-[1px] bg-primary h-[100]"></div>
          <a
            href="/signup"
            className={`border-b-transparent border-b-2 text-primary hover:border-primary flex items-center gap-2 pb-1${
              pathname === "/signup" ? "!border-b-primary" : ""
            }`}
          >
            <span className="icon-[hugeicons--user-list] text-2xl"></span>
            Registrarse
          </a>
        </nav>
      )}
    </header>
  );
};
