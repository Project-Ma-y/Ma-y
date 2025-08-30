// src/services/bookingApi.ts
import { api } from "@/lib/api";

export const createBooking = async (payload: any) => {
  try {
    const { data } = await api.post("/booking", payload);
    return data;
  } catch (e: any) {
    const res = e?.response;
    console.group("[createBooking error]");
    console.log("status:", res?.status);
    console.log("statusText:", res?.statusText);
    console.log("headers:", res?.headers);
    console.log("data:", res?.data); // ← 서버가 구체 메시지를 주면 여기에 옴
    console.groupEnd();
    throw e;
  }
};
