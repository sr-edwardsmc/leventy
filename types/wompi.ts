export enum PAYMENT_METHOD {
  CARD = "CARD",
  NEQUI = "NEQUI",
  PSE = "PSE",
  DAVIPLATA = "DAVIPLATA",
}

export interface FinancialInstitution {
  financial_institution_code: string;
  financial_institution_name: string;
}

export interface IFinancialInstitutionsResponse {
  data: FinancialInstitution[];
}

export interface IGetAcceptanceTokenResponse {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
      permalink: string;
    };
  };
}

export interface ITokenizeCardInput {
  number: string;
  cvc: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
}

export interface ITokenizeCardResponse {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    expires_at: string;
  };
}

export interface ICreateTransactionInput {
  reference: string;
  acceptance_token: string;
  amount_in_cents: number;
  currency: string;
  signature: string;
  customer_email: string;
  payment_method: {
    type: PAYMENT_METHOD;
    token: string;
    installments: number;
    payment_description?: string;
  };
  payment_source_id?: string;
  expiration_time?: string;
  redirect_url?: string;
  customer_data?: {
    full_name: string;
    legal_id: string;
    email: string;
    phone_number: string;
    legal_id_type: string;
  };
  shipping_address?: {
    address_line_1: string;
    address_line_2: string;
    phone_number: string;
    name: string;
    city: string;
    country: string;
    region: string;
    postal_code: string;
  };
}

export interface ITransactionResponse {
  data: ICreateTransactionInput & {
    id: string;
    created_at: string;
    status: string;
    status_message: string;
    payment_method: {
      extra: { processor_response_code: string; async_payment_url?: string };
    };
  };
}

export interface ICreateSignatureInput {
  transactionReference: string;
  amount: number;
  currency: string;
  expirationTime?: string;
}
