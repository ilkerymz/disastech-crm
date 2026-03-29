import type { AxiosError } from "axios";
import { getUsers, type AdminUser } from "./admin.api";
import { apiClient } from "./client";

const normalizeAssignableUsers = (value: unknown): AdminUser[] => {
  const data = Array.isArray(value)
    ? value
    : Array.isArray((value as { content?: unknown[] })?.content)
      ? (value as { content: unknown[] }).content
      : [];

  return data
    .map((item) => {
      const raw = (item ?? {}) as Record<string, unknown>;
      const rawId = raw.id ?? raw.userId ?? raw.uuid;

      return {
        id: typeof rawId === "string" && rawId.trim() ? rawId : undefined,
        fullName:
          typeof raw.fullName === "string" && raw.fullName.trim()
            ? raw.fullName
            : "-",
        email:
          typeof raw.email === "string" && raw.email.trim() ? raw.email : "-",
        role: typeof raw.role === "string" && raw.role.trim() ? raw.role : "-",
      };
    })
    .filter((user) => user.id);
};

const isNotFound = (error: unknown) =>
  Boolean((error as AxiosError)?.response?.status === 404);

export const getAssignableUsers = async (): Promise<AdminUser[]> => {
  try {
    const res = await apiClient.get("/users/options");
    return normalizeAssignableUsers(res.data);
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
    return getUsers();
  }
};
