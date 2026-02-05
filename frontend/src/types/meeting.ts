export interface Meeting {
  id: number;
  meetingDate: string;
  status: string;
  outcome: string;
  accountName: string;
  subject: string
  contactName: string;
  hasCalendarEvent: boolean;
  industry?: string;
  accountStatus?: string;
  nextAction?: string;
  userName?: string;
  nextActionDate?: Date;
  notes?: string;
  mailStatus: "NOT_SENT" | "SENT";
}
