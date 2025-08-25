import { db } from "../utils/firebase";
import { AggregateField } from "firebase-admin/firestore";

const SESSION_COLLECTION = "sessions";
const collectionRef = db.collection(SESSION_COLLECTION);

// 회원가입 전환율
// 회원가입 완료한 세션 id 개수 / 세션 id 개수
export const getSignupConversionService = async () =>{
 try {
    //세션 id 개수
    const snapshotA = await collectionRef.count().get();
    //회원가입 완료한 세션 id 개수
    const sumAggregateQuery = collectionRef.aggregate({
         totalUserId: AggregateField.sum('isRegistered'),
       });
    const snapshotB = await sumAggregateQuery.get();

    const signupConversion = snapshotB.data().totalUserId / snapshotA.data().count;
    console.log(`회원가입 완려한 세션 id 개수: ${snapshotB.data().totalUserId}, 세션 id 개수: ${snapshotA.data().count}`) //test
    return signupConversion;
  } catch (error) {
    console.error("❌ getSignupConversionService 오류:", error);
    throw new Error("statsService: getSignupConversionService 오류 발생");
  }
};

// 동행 신청 페이지 도달율
// 동행 신청 페이지 도달 횟수가 1 이상인 id 개수 / 세션 id 개수
export const getApplicationReachService = async () =>{
 try {
    //세션 id 개수
    const snapshotA = await collectionRef.count().get();
    //동행 신청 페이지 도달 횟수가 1 이상인 id 개수
    const snapshotB = await collectionRef.where('visitApplyPageCount', '>', 0).get();

    const applicationReach = snapshotB.data().count / snapshotA.data().count;
    return applicationReach;
  } catch (error) {
    console.error("❌ getApplicationReachService 오류:", error);
    throw new Error("statsService: getApplicationReachService 오류 발생");
  }
};

// 동행 신청 전환율
// 동행 신청 완료 회수가 1 이상인 세션 id 개수 / 세션 id 개수
export const getApplicationConversionService = async () =>{
 try {
    //세션 id 개수
    const snapshotA = await collectionRef.count().get();
    //동행 신청 페이지 도달 횟수가 1 이상인 id 개수
    const snapshotB = await collectionRef.where('applyCount', '>', 0).get();

    const applicationConversion = snapshotB.data().count / snapshotA.data().count;
    return applicationConversion;
  } catch (error) {
    console.error("❌ getApplicationConversionService 오류:", error);
    throw new Error("statsService: getApplicationConversionService 오류 발생");
  }
};