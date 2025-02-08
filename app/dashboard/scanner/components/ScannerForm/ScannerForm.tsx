"use client";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { QrReader } from "../QRScanner/QRScanner";
import { getSession } from "@/utils/auth";
import { TUserWithRelations } from "@/types/users";

export const ScannerForm = () => {
  const [scannerOpened, setScannerOpened] = useState(false);

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
    <>
      {!scannerOpened && (
        <section className="p-20 w-full h-svh flex flex-col items-center justify-between">
          <Image
            src={"/synapsis-logo.png"}
            alt="Logo"
            width={150}
            height={150}
            className="rounded-full"
          />
          <button
            onClick={() => setScannerOpened(true)}
            className="w-full h-[4em] bg-black text-white py-2 rounded-md text-lg"
          >
            Escanear código QR
          </button>
        </section>
      )}
      {scannerOpened && <QrReader onClose={() => setScannerOpened(false)} />}
    </>
  );
};
