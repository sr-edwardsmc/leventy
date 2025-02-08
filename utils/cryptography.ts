import { SignJWT, jwtVerify } from "jose";
import { hash, compareSync } from "bcryptjs";

const secretKey = process.env.SESSION_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export const bcryptHash = async (text: string) => {
  const hashedText = await hash(text, 12);
  return hashedText;
};

export const bcryptCompare = async (text: string, hashedText: string) => {
  return await compareSync(text, hashedText);
};

export const encryptJWT = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24 hours from now")
    .sign(key);
};

export const decryptJWT = async (input: string): Promise<unknown> => {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
};
