// src/services/bookingApi.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

// 공통 api 인스턴스를 쓰되, 이 호출만 헤더를 덮어써서 '확실히' Authorization을 붙임
import { api } from "@/lib/api";

export async function createBooking(payload: {
  startBookingTime: string;
  endBookingTime: string;
  departureAddress: string;
  destinationAddress: string;
  roundTrip: boolean;
  assistanceType: "guide" | "admin" | "shopping" | "other";
  additionalRequests?: string;
}) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");

  const token = await user.getIdToken(); // 필요시 true로 강제 갱신도 가능
  const { data } = await api.post<{ bookingId: string }>(
    "/api/booking/",
    payload,
    {
      // 인터셉터가 실패해도 여기서 '반드시' 붙음
      headers: { Authorization: `Bearer ${token}` },
      // 쿠키도 같이 보내야 한다면 아래를 true로 (서버 CORS 설정 필수)
      // withCredentials: true,
    }
  );
  return data;
}
