"use server";
import { Prisma } from "@prisma/client";

import db from "@/config/db";
import { bcryptHash } from "@/utils/cryptography";

export const createNewUser = async (userData: Prisma.UserCreateInput) => {
  const encryptedPassword = await bcryptHash(userData.password);
  const createdUser = await db.user.create({
    data: { ...userData, password: encryptedPassword },
  });

  if (!createdUser) {
    throw new Error("Error creating user");
  }

  return createdUser;
};
