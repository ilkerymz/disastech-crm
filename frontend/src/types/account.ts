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
  phone: string | null;
  email: string | null;
  status: AccountStatus;
  responsibleUserId?: string | null;
  responsibleUserName?: string | null;
}
