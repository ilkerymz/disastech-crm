const TOKEN_KEY = "auth_token";
const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "";

export const getToken = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const setToken = (token: string) => {
  if (!token || token === "undefined" || token === "null") {
    clearToken();
    return;
  }
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => Boolean(getToken());

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
};

const getTokenPayload = (): Record<string, unknown> | null => {
  const token = getToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const getUserIdFromToken = () => {
  const payload = getTokenPayload();
  if (!payload) return null;

  const userId = payload.userId ?? payload.user_id ?? payload.id ?? payload.sub;
  return typeof userId === "string" ? userId : null;
};

export const getUserEmailFromToken = () => {
  const payload = getTokenPayload();
  if (!payload) return null;

  const rawEmail = payload.email ?? payload.username ?? payload.preferred_username ?? payload.sub;
  return typeof rawEmail === "string" ? rawEmail : null;
};

export const isSuperAdmin = () => {
  if (!SUPER_ADMIN_EMAIL) return false;

  const email = getUserEmailFromToken();
  if (!email) return false;

  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.trim().toLowerCase();
};

export const getPostLoginRoute = () => (isSuperAdmin() ? "/admin/users" : "/meetings");
