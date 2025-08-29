// src/services/familyApi.ts
import { api } from "@/lib/api";
/**
 * POST /api/users/family
 * 서버 스펙: { registeredFamily: FamilyPayload[] }
 * 단일/복수 입력 모두 지원 (단일은 내부에서 배열로 래핑)
 * 응답: 200 "회원 업데이트 성공"
 */
export async function createFamily(input) {
    const registeredFamily = Array.isArray(input) ? input : [input];
    const { data } = await api.post("/users/family", { registeredFamily });
    return data; // "회원 업데이트 성공"
}
/**
 * PUT /api/users/family/:mid
 */
export async function updateFamily(mid, payload) {
    const { data } = await api.put(`/users/family/${mid}`, payload);
    return data;
}
/**
 * DELETE /api/users/family/:mid
 */
export async function deleteFamily(mid) {
    const { data } = await api.delete(`/users/family/${mid}`);
    return data;
}
