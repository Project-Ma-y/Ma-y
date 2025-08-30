// src/lib/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 예: https://api.mayservice.co.kr/api
  withCredentials: false, // 세션쿠키 방식이면 true, Bearer면 false여도 됨
  headers: { 'Content-Type': 'application/json' },
});
