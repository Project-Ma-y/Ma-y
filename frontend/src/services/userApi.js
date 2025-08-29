// src/services/userApi.ts
import { api } from "@/lib/api";
export async function updateMyProfile(payload) {
    const { data } = await api.put("/users/me/profile", payload);
    return data;
}
