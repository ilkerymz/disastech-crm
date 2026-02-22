import type {
  LossReason,
  Meeting,
  SalesStage,
  SalesStatus,
} from "../types/meeting";
import { apiClient } from "./client";

export interface CreateMeetingPayload {
  accountId: string;
  contactId?: string;
  ownerUserId: string;
  start: string;
  end: string;
  subject?: string;
  outcome?: string;
  salesStatus?: SalesStatus;
  salesStage?: SalesStage;
  offerAmount?: number;
  lastMeetingDate?: string;
  lossReason?: LossReason;
}

export interface MeetingNote {
  id: string | number;
  note: string;
  createdAt: string;
  createdByName?: string;
}

export interface InvitePreview {
  subject: string;
  description: string;
  recipients: string[];
}

export const getMeetings = async (): Promise<Meeting[]> => {
  const res = await apiClient.get("/meetings");
  return res.data;
};


export const createMeeting = async (payload: CreateMeetingPayload) => {
  const res = await apiClient.post("/meetings", payload);
  return res.data;
};

export const getMeetingNotes = async (
  meetingId: string
): Promise<MeetingNote[]> => {
  const res = await apiClient.get(`/meetings/${meetingId}/notes`);
  return res.data;
};

export const addMeetingNote = async (meetingId: string, note: string) => {
  const res = await apiClient.post(`/meetings/${meetingId}/notes`, { note });
  return res.data;
};

export const sendMeetingInvite = async (
  meetingId: string,
  description?: string
) => {
  await apiClient.post(
    `/meetings/${meetingId}/send-invite`,
    null,
    description
      ? {
          params: { description },
        }
      : undefined
  );
};

export const getInvitePreview = async (meetingId: string): Promise<InvitePreview> => {
  const res = await apiClient.get(`/meetings/${meetingId}/invite-preview`);
  return res.data;
};

export const updateMeeting = async (
  id: string,
  payload: Partial<Meeting>
) => {
  const res = await apiClient.put(`/meetings/${id}`, payload);
  return res.data;
};

export const cancelMeeting = async (id: string) => {
  await apiClient.delete(`/meetings/${id}`);
};
