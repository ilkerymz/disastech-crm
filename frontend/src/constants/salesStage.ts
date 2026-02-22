import type { SalesStage } from "../types/meeting";

export const SALES_STAGE_OPTIONS: SalesStage[] = [
  "FIRST_MEETING",
  "DEMO",
  "OFFER",
  "REVISION",
  "CONTRACT",
  "NEGATIVE",
];

export const SALES_STAGE_LABELS: Record<SalesStage, string> = {
  FIRST_MEETING: "İlk Görüşme",
  DEMO: "Demo",
  OFFER: "Teklif",
  REVISION: "Revizyon",
  CONTRACT: "Sözleşme",
  NEGATIVE: "Olumsuz",
};

export const getSalesStageLabel = (stage?: SalesStage | null) => {
  if (!stage) return "-";
  return SALES_STAGE_LABELS[stage] ?? stage;
};
