// src/lib/adminEndpoints.ts
export type Http = "GET" | "POST" | "DELETE" | "PUT" | "PATCH"

export const ADMIN_ENDPOINTS: { name: string; method: Http; path: string }[] = [
  { name: "회원가입 전환율",           method: "GET",    path: "/stats/signup-conversion" },
  { name: "동행 신청 도달율",           method: "GET",    path: "/stats/application-reach" },
  { name: "동행 신청 전환율",           method: "GET",    path: "/stats/application-conversion" },
  { name: "가입자 집계",               method: "GET",    path: "/users/" },
  { name: "회원 상세 정보 조회",        method: "GET",    path: "/users/:id" },
  { name: "회원 삭제",                 method: "DELETE", path: "/users/:id" },
]
