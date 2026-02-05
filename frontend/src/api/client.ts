import axios from "axios";
import { getToken } from "../auth/token";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
