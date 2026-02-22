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

export const getContactsByAccountAndActiveTrue = async (
  accountId: string
): Promise<Contact[]> => {
  const res = await apiClient.get("/contacts/active", {
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

export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contacts/${id}`);
};

export const updateContact = async (
  id: string,
  payload: {
    fullName: string;
    email?: string;
  }
): Promise<Contact> => {
  const res = await apiClient.put(`/contacts/${id}`, payload);
  return res.data;
};
