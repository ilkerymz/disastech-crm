const TOKEN_KEY = "auth_token";

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

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const userId = payload.userId ?? payload.user_id ?? payload.id ?? payload.sub;
    return typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
};
