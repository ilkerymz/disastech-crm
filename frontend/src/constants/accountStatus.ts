import type { AccountStatus } from "../types/account";

export const ACCOUNT_STATUS_OPTIONS: AccountStatus[] = [
  "ACTIVE",
  "POTENTIAL",
  "DEMO",
  "PARTNER",
  "CONSULTANT",
  "SUPPLIER",
  "PASSIVE",
];

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: "Aktif",
  POTENTIAL: "Potansiyel",
  DEMO: "Demo",
  PARTNER: "İş Ortağı",
  CONSULTANT: "Danışman",
  SUPPLIER: "Tedarikçi",
  PASSIVE: "Pasif",
};

export const getAccountStatusLabel = (status?: string | null) => {
  if (!status) return "-";
  return (
    ACCOUNT_STATUS_LABELS[status as AccountStatus] ??
    status
  );
};
