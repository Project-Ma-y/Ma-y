// src/lib/axios.ts  (Authorization 자동 첨부)
import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://ma-y-5usy.onrender.com/api", // 필요 시 지정
    withCredentials: false,
    headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("idToken");
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
