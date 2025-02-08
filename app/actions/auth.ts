"use server";
import { cookies } from "next/headers";

import db from "@/config/db";
import { TUserWithRelations } from "@/types/users";
import { setSession } from "@/utils/auth";
import { bcryptCompare } from "@/utils/cryptography";

interface SignInResponse {
  loggedUser: TUserWithRelations;
}

export const signIn = async (
  type: string,
  data: FormData
): Promise<SignInResponse | null> => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const userFound = await db.user.findFirst({
    where: { email },
    include: { collective: true },
  });

  if (userFound) {
    const isPasswordValid = await bcryptCompare(password, userFound.password);
    if (isPasswordValid) {
      setSession(userFound);
      return { loggedUser: userFound };
    }
  }
  const error = new Error("An error occurred while signing in.");
  error.message = "CredentialsSignin";
  throw error;
};

export const signOut = async () => {
  cookies().set("session", "", { expires: new Date(0) });
};
