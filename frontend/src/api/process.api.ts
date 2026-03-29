import type { AxiosError } from "axios";
import { getActiveAccounts } from "./account.api";
import { apiClient } from "./client";
import type { Process, ProcessNote, UpdateProcessPayload } from "../types/process";

interface PageableResponse<T> {
  content?: T[];
}

const extractContent = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === "object" &&
    "content" in value &&
    Array.isArray((value as PageableResponse<T>).content)
  ) {
    return (value as PageableResponse<T>).content ?? [];
  }

  return [];
};

const isNotFoundError = (error: unknown) =>
  Boolean((error as AxiosError)?.response?.status === 404);

export const getProcesses = async (): Promise<Process[]> => {
  try {
    const res = await apiClient.get("/processes");
    return extractContent<Process>(res.data);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    const accounts = await getActiveAccounts();
    return accounts.map((account) => ({
      id: account.id,
      accountId: account.id,
      accountName: account.name,
      accountStatus: account.status,
      salesStage: null,
      estimatedValue: null,
      estimatedCurrency: "TRY",
      lastMeetingDate: null,
      nextAction: null,
      nextActionDate: null,
      latestNote: null,
      updatedAt: null,
      noteCount: 0,
    }));
  }
};

export const updateProcess = async (
  processId: string,
  payload: UpdateProcessPayload
): Promise<Process> => {
  const res = await apiClient.put(`/processes/${processId}`, payload);
  return res.data;
};

export const getProcessNotes = async (
  processId: string
): Promise<ProcessNote[]> => {
  const res = await apiClient.get(`/processes/${processId}/notes`);
  return extractContent<ProcessNote>(res.data);
};

export const addProcessNote = async (
  processId: string,
  payload: {
    note: string;
    isNegativeReason?: boolean;
  }
): Promise<ProcessNote> => {
  const res = await apiClient.post(`/processes/${processId}/notes`, payload);
  return res.data;
};
