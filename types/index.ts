export enum PAYMENT_PROVIDER {
  WOMPI_PSE = "WOMPI_PSE",
  WOMPI_CARD = "WOMPI_CARD",
  WOMPI_NEQUI = "WOMPI_NEQUI",
  WOMPI_DAVIPLATA = "WOMPI_DAVIPLATA",
}

export enum CURRENCY {
  USD = "USD",
  EUR = "EUR",
  COP = "COP",
  GBP = "GBP",
}

export interface ITicketingSelection {
  ticketingId: string;
  amount: number;
}
