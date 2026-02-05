import type { Meeting } from "../types/meeting";
import { apiClient } from "./client";

export interface CreateMeetingPayload {
  accountId: string;
  contactId?: string;
  ownerUserId: string;
  start: string;
  end: string;
  subject?: string;
  outcome?: string;
  nextActionDate?: string;
  notes?: string;
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

export const sendMeetingInvite = async (meetingId: string) => {
  await apiClient.post(`/meetings/${meetingId}/send-invite`);
};

export const getInvitePreview = async (meetingId: string): Promise<InvitePreview> => {
  const res = await apiClient.get(`/meetings/${meetingId}/invite-preview`);
  return res.data;
};

export const updateMeeting = async (
  id: string,
  payload: any
) => {
  const res = await apiClient.put(`/meetings/${id}`, payload);
  return res.data;
};

export const cancelMeeting = async (id: string) => {
  await apiClient.delete(`/meetings/${id}`);
};

