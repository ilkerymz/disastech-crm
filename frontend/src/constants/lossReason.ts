import type { LossReason } from "../types/meeting";

export const LOSS_REASON_OPTIONS: LossReason[] = [
  "PRICE",
  "RIVAL",
  "BUDGET",
  "PRIORITY_CHANGED",
];

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  PRICE: "Fiyat",
  RIVAL: "Rakip",
  BUDGET: "Bütçe",
  PRIORITY_CHANGED: "Öncelik Değişti",
};

export const getLossReasonLabel = (reason?: LossReason | null) => {
  if (!reason) return "-";
  return LOSS_REASON_LABELS[reason] ?? reason;
};
