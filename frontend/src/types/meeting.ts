export type SalesStatus = "SOLD" | "PROGRESSING" | "LOST";
export type SalesStage =
  | "FIRST_MEETING"
  | "DEMO"
  | "OFFER"
  | "REVISION"
  | "CONTRACT"
  | "POSITIVE"
  | "NEGATIVE";
export type LossReason =
  | "PRICE"
  | "RIVAL"
  | "BUDGET"
  | "PRIORITY_CHANGED";

export interface MeetingAttendee {
  id?: string;
  attendeeType: "OWNER" | "CONTACT" | "USER";
  userId?: string;
  contactId?: string;
  email: string;
  displayName: string;
  isPrimary?: boolean;
}

export interface Meeting {
  id: number;
  accountId?: string;
  ownerUserId?: string;
  contactId?: string;
  start: string;
  end: string;
  status: string;
  outcome: string;
  accountName: string;
  subject: string
  contactName: string;
  contactTitle?: string;
  hasCalendarEvent: boolean;
  industry?: string;
  accountStatus?: string;
  userName?: string;
  notes?: string;
  mailStatus: "NOT_SENT" | "SENT";
  attendees?: MeetingAttendee[];
}
