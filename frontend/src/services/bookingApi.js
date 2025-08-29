// src/services/bookingApi.ts
import { api } from "@/lib/api";
export async function createBooking(payload) {
    // /api 프록시 경유 → 동일 출처, 쿠키 자동, 토큰 자동
    const { data } = await api.post("/booking", payload);
    // 기대 응답: { bookingId }
    return data;
}
export async function getMyBookings() {
    const { data } = await api.get("/booking/my");
    return data;
}
