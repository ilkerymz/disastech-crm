import type { SalesStatus } from "../types/meeting";

export const SALES_STATUS_OPTIONS: SalesStatus[] = [
  "SOLD",
  "PROGRESSING",
  "LOST",
];

export const SALES_STATUS_LABELS: Record<SalesStatus, string> = {
  SOLD: "Satıldı",
  PROGRESSING: "Devam",
  LOST: "Kaybedildi",
};

export const SALES_STATUS_COLORS: Record<SalesStatus, string> = {
  SOLD: "#20c20e",
  PROGRESSING: "#f5d90a",
  LOST: "#ff1b1b",
};

export const getSalesStatusLabel = (status?: SalesStatus | null) => {
  if (!status) return "-";
  return SALES_STATUS_LABELS[status] ?? status;
};
