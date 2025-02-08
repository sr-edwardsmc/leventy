import {
  ICreateSignatureInput,
  ICreateTransactionInput,
  IFinancialInstitutionsResponse,
  IGetAcceptanceTokenResponse,
  ITokenizeCardInput,
  ITokenizeCardResponse,
  ITransactionResponse,
} from "@/types/wompi";

abstract class PaymentService {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  tokenizeCard<Response>(args: ITokenizeCardInput): Response {
    throw new Error("Method not implemented.");
  }
}
// First of all get the acceptance token
// After that, the process consist in first got the payment method (card, nequi) and then tokenize the card or nequi account
// Using the acceptanceToken + tokenizedToken + userEmail = generate the payment source ID
// Using the paymentSourceID + amount + currency + user = generate the transaction

export class WompiClient {
  apiUrl: string;
  publicKey: string;
  privateKey: string;
  integritySecretKey: string;

  constructor() {
    this.apiUrl = String(process.env.WOMPI_API_URL);
    this.publicKey = String(process.env.WOMPI_PUBLIC_KEY);
    this.privateKey = String(process.env.WOMPI_PRIVATE_KEY);
    this.integritySecretKey = String(process.env.WOMPI_INTEGRITY_KEY);
  }

  getRedirectURL(): string {
    const redirectURL = process.env.WOMPI_REDIRECT_URL!;
    return redirectURL;
  }

  async createSignature(args: ICreateSignatureInput): Promise<string> {
    const concatenatedString = `${args.transactionReference}${args.amount}${args.currency}${args.expirationTime}${this.integritySecretKey}`;
    const encondedText = new TextEncoder().encode(concatenatedString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  async getAcceptanceToken(): Promise<IGetAcceptanceTokenResponse> {
    const endpointUrl = `${this.apiUrl}/merchants/${this.publicKey}`;
    const response = await fetch(endpointUrl, { method: "GET" });

    return await response.json();
  }

  async tokenizeCard(
    cardData: ITokenizeCardInput
  ): Promise<ITokenizeCardResponse> {
    const endpointUrl = `${this.apiUrl}/tokens/cards`;
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify(cardData),
    });

    return await response.json();
  }

  async tokenizeNequi<Response>(phoneNumber: string): Promise<Response> {
    const endpointUrl = `${this.apiUrl}/tokens/nequi`;
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    return await response.json();
  }

  async createTransaction(
    transactionData: ICreateTransactionInput
  ): Promise<ITransactionResponse> {
    const endpointUrl = `${this.apiUrl}/transactions`;
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
      },
      body: JSON.stringify(transactionData),
    });
    return await response.json();
  }

  async getTransactionById(
    transactionId: string
  ): Promise<ITransactionResponse> {
    const endpointUrl = `${this.apiUrl}/transactions/${transactionId}`;
    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
      },
    });

    return await response.json();
  }

  async getAllTransactions<Response>(): Promise<Response> {
    return {} as Response;
  }

  voidTransaction<Response>(): Response {
    return {} as Response;
  }

  async getPSEFinancialInstitutions(): Promise<IFinancialInstitutionsResponse> {
    const endpointUrl = `${this.apiUrl}/pse/financial_institutions`;
    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
      },
    });

    return (await response.json()) as IFinancialInstitutionsResponse;
  }
}
