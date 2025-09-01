import { db } from "../utils/firebase";
import { SessionPayload } from "../interfaces/session";
import { v4 as uuidv4 } from "uuid";

/**
 * 새로운 세션을 초기화하고 Firestore에 저장
 * @param userId Firebase UID (비회원은 빈 문자열 가능)
 * @returns 생성된 세션 ID
 */
export async function initSession(userId: string = "", isTest: boolean = false) {
  try {
    const sessionId = uuidv4();
    const now = new Date().toISOString();

    const collectionName = isTest ? "testSessions" : "sessions";
    const collectionRef = db.collection(collectionName);

    //만약 userId가 존재한다면 userId 넣어서 처리
    let isRegistered: boolean;
    if(!userId) isRegistered = false;
    else isRegistered = true;

    const sessionData: SessionPayload = {
      createdAt: now,
      isRegistered,
      visitApplyPageCount: 0,
      applyCount: 0,
      userId
    };

    await collectionRef.doc(sessionId).set(sessionData);

    return sessionId;
  } catch (error) {
    console.error("❌ 세션 생성 실패:", error);
    throw new Error("세션 초기화 중 오류 발생");
  }
}

/**
 * 세션이 존재하면 갱신, 없으면 생성
 * @param sessionId 쿠키에서 가져온 세션 ID
 * @param updates 업데이트할 필드
 * @returns sessionId
 */
export async function updateSession(sessionId: string, updates: Partial<SessionPayload>, isTest: boolean = false) {
  try {
    if (!sessionId) {
      throw new Error("세션 ID가 없습니다");
    }
    const collectionName = isTest ? "testSessions" : "sessions";
    const collectionRef = db.collection(collectionName);

    const ref = await collectionRef.doc(sessionId);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      console.warn("⚠️ 세션 없음, 새로 생성:", sessionId);
      const newsessionId = await initSession();
      await collectionRef.doc(newsessionId).update(updates);
      return newsessionId;
    } else {
      await ref.update(updates);
      return sessionId;
    }

  } catch (error) {
    console.error("❌ 세션 갱신 실패:", error);
    throw new Error("세션 업데이트 중 오류 발생");
  }
}
