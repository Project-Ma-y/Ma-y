import { db } from "../utils/firebase";
import { AggregateField } from "firebase-admin/firestore";

const SESSION_COLLECTION = "sessions";
const collectionRef = db.collection(SESSION_COLLECTION);


// 회원가입 전환율
// 회원가입 완료한 세션 id 개수 / 세션 id 개수
export const getSignupConversionService = async () => {
  try {
    const snapshot = await collectionRef.get();

    //날짜별 집계를 담을 Map
    const statsMap = new Map<
      string,
      { sessions: number; signupSessions: number }
    >();

    snapshot.forEach((doc: any) => {
      const data = doc.data();

      //날짜
      if (!data.createdAt) return;
      const date = data.createdAt.split("T")[0];
      if (!statsMap.has(date)) {
        statsMap.set(date, { sessions: 0, signupSessions: 0 });
      }

      const entry = statsMap.get(date)!;
      entry.sessions += 1;
      if (data.isRegistered) {
        entry.signupSessions += 1;
      }
    })

    // Map → Array 변환 & 날짜순 정렬
    let result = Array.from(statsMap.entries()).map(([date, value]) => ({
      date,
      ...value,
    }));
    result.sort((a, b) => a.date.localeCompare(b.date));


    //누적(total) 값 추가
    let totalSessions = 0;
    let totalSignupSessions = 0;

    result = result.map((entry) => {
      totalSessions += entry.sessions;
      totalSignupSessions += entry.signupSessions;
      return {
        ...entry,
        totalSessions,
        totalRegisteredSessions: totalSignupSessions,
      };
    });

    return result;
  } catch (error) {
    console.error("❌ getSignupConversionService 오류:", error);
    throw new Error("statsService: getSignupConversionService 오류 발생");
  }
};


// 동행 신청 페이지 도달율
// 동행 신청 페이지 도달 횟수가 1 이상인 id 개수 / 세션 id 개수
export const getApplicationReachService = async () => {
  try {
    const snapshot = await collectionRef.get();

    //날짜별 집계를 담을 Map
    const statsMap = new Map<
      string,
      { sessions: number; reachApplypageSessions: number }
    >();

    snapshot.forEach((doc: any) => {
      const data = doc.data();

      //날짜
      if (!data.createdAt) return;
      const date = data.createdAt.split("T")[0];
      if (!statsMap.has(date)) {
        statsMap.set(date, { sessions: 0, reachApplypageSessions: 0 });
      }

      const entry = statsMap.get(date)!;
      entry.sessions += 1;
      if (data.visitApplyPageCount > 0) {
        entry.reachApplypageSessions += 1;
      }
    })

    // Map → Array 변환 & 날짜순 정렬
    let result = Array.from(statsMap.entries()).map(([date, value]) => ({
      date,
      ...value,
    }));
    result.sort((a, b) => a.date.localeCompare(b.date));


    //누적(total) 값 추가
    let totalSessions = 0;
    let totalReachApplypageSessions = 0;

    result = result.map((entry) => {
      totalSessions += entry.sessions;
      totalReachApplypageSessions += entry.reachApplypageSessions;
      return {
        ...entry,
        totalSessions,
        totalRegisteredSessions: totalReachApplypageSessions,
      };
    });

    return result;
  } catch (error) {
    console.error("❌ getApplicationReachService 오류:", error);
    throw new Error("statsService: getApplicationReachService 오류 발생");
  }
};


// 동행 신청 전환율
// 동행 신청 완료 회수가 1 이상인 세션 id 개수 / 세션 id 개수
export const getApplicationConversionService = async () => {
  try {
    const snapshot = await collectionRef.get();

    //날짜별 집계를 담을 Map
    const statsMap = new Map<
      string,
      { sessions: number; applyCompleteSessions: number }
    >();

    snapshot.forEach((doc: any) => {
      const data = doc.data();

      //날짜
      if (!data.createdAt) return;
      const date = data.createdAt.split("T")[0];
      if (!statsMap.has(date)) {
        statsMap.set(date, { sessions: 0, applyCompleteSessions: 0 });
      }

      const entry = statsMap.get(date)!;
      entry.sessions += 1;
      if (data.applyCount > 0) {
        entry.applyCompleteSessions += 1;
      }
    })

    // Map → Array 변환 & 날짜순 정렬
    let result = Array.from(statsMap.entries()).map(([date, value]) => ({
      date,
      ...value,
    }));
    result.sort((a, b) => a.date.localeCompare(b.date));


    //누적(total) 값 추가
    let totalSessions = 0;
    let totalApplyCompleteSessions = 0;

    result = result.map((entry) => {
      totalSessions += entry.sessions;
      totalApplyCompleteSessions += entry.applyCompleteSessions;
      return {
        ...entry,
        totalSessions,
        totalRegisteredSessions: totalApplyCompleteSessions,
      };
    });

    return result;
  } catch (error) {
    console.error("❌ getApplicationConversionService 오류:", error);
    throw new Error("statsService: getApplicationConversionService 오류 발생");
  }
};