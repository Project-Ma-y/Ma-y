// interfaces/session.ts
export interface SessionPayload {
  createdAt: string; // 최초 접속 시간 (필수)
  isRegistered: boolean; // 회원가입 완료 여부 (필수)
  registeredAt?: string; // 회원가입 완료 시간 (선택)
  userId?: string; //userId

  visitApplyPageCount: number; // 동행 신청 페이지 도달 횟수 (필수)
  lastVisitApplyPageAt?: string; // 최근 도달 시간

  applyCount: number; // 신청 완료 횟수 (필수)
  lastApplyAt?: string; // 최근 신청 완료 시간
}
