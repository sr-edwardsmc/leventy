import { Collective, User } from "@prisma/client";

export type TUser = User;

export type TUserWithRelations = User & {
  collective: Collective | null;
};
