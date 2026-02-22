export type SalesStatus = "SOLD" | "PROGRESSING" | "LOST";
export type SalesStage =
  | "FIRST_MEETING"
  | "DEMO"
  | "OFFER"
  | "REVISION"
  | "CONTRACT"
  | "NEGATIVE";
export type LossReason =
  | "PRICE"
  | "RIVAL"
  | "BUDGET"
  | "PRIORITY_CHANGED";

export interface Meeting {
  id: number;
  start: string;
  end: string;
  status: string;
  outcome: string;
  accountName: string;
  subject: string
  contactName: string;
  hasCalendarEvent: boolean;
  industry?: string;
  accountStatus?: string;
  salesStatus?: SalesStatus;
  salesStage?: SalesStage;
  offerAmount?: number;
  lastMeetingDate?: string;
  lossReason?: LossReason;
  nextAction?: string;
  userName?: string;
  latestNote?: string;
  noteCount?: number;
  notes?: string;
  mailStatus: "NOT_SENT" | "SENT";
}
