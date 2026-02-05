import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await apiClient.post("/auth/login", payload);
  return res.data;
};
