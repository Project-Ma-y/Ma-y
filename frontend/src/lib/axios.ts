// src/lib/axios.ts  (Authorization 자동 첨부)
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // 필요 시 지정
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
