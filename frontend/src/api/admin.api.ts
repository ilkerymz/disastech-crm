import { apiClient } from "./client";

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface AdminUser {
  id?: string;
  fullName: string;
  email: string;
  role: string;
}

const toText = (value: unknown, fallback = "-") =>
  typeof value === "string" && value.trim() ? value : fallback;

const normalizeUser = (item: unknown): AdminUser => {
  const raw = (item ?? {}) as Record<string, unknown>;
  const rawId = raw.id ?? raw.userId ?? raw.uuid;
  const id = typeof rawId === "string" && rawId.trim() ? rawId : undefined;

  return {
    id,
    fullName: toText(raw.fullName ?? raw.name),
    email: toText(raw.email ?? raw.username),
    role: toText(raw.role),
  };
};

export const getUsers = async (): Promise<AdminUser[]> => {
  const res = await apiClient.get("/admin/users");
  const data = res.data as unknown;

  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { content?: unknown[] })?.content)
      ? (data as { content: unknown[] }).content
      : [];

  return list.map(normalizeUser);
};

export const createUser = async (payload: CreateUserPayload): Promise<string> => {
  const res = await apiClient.post("/admin/users", payload);
  const data = res.data as unknown;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const maybeMessage = (data as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
  }

  throw new Error("Create user response format is invalid.");
};

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  role: string;
  password?: string;
}

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<string> => {
  const res = await apiClient.put(`/admin/users/${id}`, payload);
  const data = res.data as unknown;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const maybeMessage = (data as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
  }

  return "User Updated";
};

export const deleteUser = async (id: string): Promise<string> => {
  const res = await apiClient.delete(`/admin/users/${id}`);
  const data = res.data as unknown;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null) {
    const maybeMessage = (data as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
  }

  return "User Deleted";
};
