export type AccountStatus =
  | "ACTIVE"
  | "POTENTIAL"
  | "DEMO"
  | "PARTNER"
  | "CONSULTANT"
  | "SUPPLIER"
  | "PASSIVE";

export interface Account {
  id: string;
  name: string;
  industry: string | null;
  status: AccountStatus;
}
