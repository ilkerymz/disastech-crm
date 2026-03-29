import type { AccountStatus } from "./account";
import type { SalesStage } from "./meeting";
import type { CurrencyCode } from "../constants/currency";

export interface Process {
  id: string;
  accountId: string;
  accountName: string;
  responsibleUserName?: string | null;
  salesStage?: SalesStage | null;
  accountStatus?: AccountStatus | null;
  estimatedValue?: number | null;
  estimatedCurrency?: CurrencyCode | null;
  lastMeetingDate?: string | null;
  nextAction?: string | null;
  nextActionDate?: string | null;
  latestNote?: string | null;
  latestNoteIsNegativeReason?: boolean | null;
  updatedAt?: string | null;
  noteCount?: number | null;
}

export interface ProcessNote {
  id: string | number;
  note: string;
  isNegativeReason?: boolean | null;
  createdAt?: string | null;
  createdByName?: string | null;
}

export interface UpdateProcessPayload {
  salesStage?: SalesStage;
  accountStatus?: AccountStatus;
  estimatedValue?: number | null;
  estimatedCurrency?: CurrencyCode | null;
  nextAction?: string | null;
  nextActionDate?: string | null;
}
