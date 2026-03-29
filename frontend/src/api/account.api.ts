import type { Account, AccountStatus } from "../types/account";
import { apiClient } from "./client";

export const getAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get("/accounts");
  return res.data;
};

export const getActiveAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get("/accounts/active");
  return res.data;
};

export const createAccount = async (payload: {
  name: string;
  industry?: string;
  phone?: string;
  email?: string;
  status: AccountStatus;
  responsibleUserId?: string;
}): Promise<Account> => {
  const res = await apiClient.post("/accounts", payload);
  return res.data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/accounts/${id}`);
};

export const updateAccount = async (
  id: string,
  payload: {
    industry?: string;
    phone?: string;
    email?: string;
    status: AccountStatus;
    responsibleUserId?: string;
  }
): Promise<Account> => {
  const res = await apiClient.put(`/accounts/${id}`, payload);
  return res.data;
};
