"use server";
import { TUser, TUserWithRelations } from "@/types/users";
import { decryptJWT, encryptJWT } from "./cryptography";
import { cookies } from "next/headers";

export const setSession = async (user: TUserWithRelations) => {
  const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encryptJWT({ ...user, expiration });
  cookies().set("session", session, {
    expires: expiration,
    httpOnly: true,
  });
};

export const getSession = async (): Promise<TUserWithRelations | null> => {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return (await decryptJWT(session)) as TUserWithRelations;
};
