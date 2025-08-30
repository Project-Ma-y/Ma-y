// src/lib/axios.ts  (Authorization 자동 첨부)
import axios from "axios";

export const api = axios.create({
baseURL: "https://api.mayservice.co.kr",
  withCredentials: false,         
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
