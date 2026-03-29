export type CurrencyCode = "TRY" | "USD" | "EUR" | "GBP" | "AED";

export const CURRENCY_OPTIONS: CurrencyCode[] = [
  "TRY",
  "USD",
  "EUR",
  "GBP",
  "AED",
];

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  TRY: "TL",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AED: "AED",
};

export const formatMoney = (
  value?: number | null,
  currency: CurrencyCode = "TRY"
) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};
