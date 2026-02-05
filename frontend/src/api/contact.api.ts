import type { Contact } from "../types/contact";
import { apiClient } from "./client";

export const getContactsByAccount = async (
  accountId: string
): Promise<Contact[]> => {
  const res = await apiClient.get("/contacts", {
    params: { accountId },
  });
  return res.data;
};

export const createContact = async (payload: {
  accountId: string;
  fullName: string;
  email?: string;
}): Promise<Contact> => {
  const res = await apiClient.post("/contacts", payload);
  return res.data;
};
