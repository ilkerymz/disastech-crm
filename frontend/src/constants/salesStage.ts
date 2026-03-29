import type { SalesStage } from "../types/meeting";

export const SALES_STAGE_OPTIONS: SalesStage[] = [
  "FIRST_MEETING",
  "DEMO",
  "OFFER",
  "REVISION",
  "CONTRACT",
  "POSITIVE",
  "NEGATIVE",
];

export const SALES_STAGE_LABELS: Record<SalesStage, string> = {
  FIRST_MEETING: "İlk Görüşme",
  DEMO: "Demo",
  OFFER: "Teklif",
  REVISION: "Revizyon",
  CONTRACT: "Sözleşme",
  POSITIVE: "Olumlu",
  NEGATIVE: "Olumsuz",
};

export const SALES_STAGE_COLORS: Record<SalesStage, string> = {
  FIRST_MEETING: "#5f6f65",
  DEMO: "#1d4ed8",
  OFFER: "#ca8a04",
  REVISION: "#7c3aed",
  CONTRACT: "#0f766e",
  POSITIVE: "#15803d",
  NEGATIVE: "#b91c1c",
};

export const getSalesStageLabel = (stage?: SalesStage | null) => {
  if (!stage) return "-";
  return SALES_STAGE_LABELS[stage] ?? stage;
};
