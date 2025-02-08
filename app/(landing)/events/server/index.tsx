"use server";
import ShortUUID from "short-unique-id";

export async function createIntegritySHA(transactionStr: string) {
  return new Promise<string>(async (resolve, reject) => {
    const encondedText = new TextEncoder().encode(transactionStr);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    resolve(hashHex);
  });
}
