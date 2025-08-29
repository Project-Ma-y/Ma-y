// src/services/userApi.ts
import { api } from "@/lib/api";

export type ProfileUpdatePayload = {
  name?: string;
  phone?: string;
  gender?: "male" | "female";
  birthdate?: string;
  address?: string;
};

export async function updateMyProfile(payload: ProfileUpdatePayload) {
  const { data } = await api.put("/users/me/profile", payload);
  return data;
}