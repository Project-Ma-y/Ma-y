// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/** ⚠️ 먼저 초기화 (app/no-app 방지) */
const firebaseConfig = {
  apiKey: "AIzaSyAaHhbv_xlkIwgp8BDI4ekkmRBl9bLI_pw",
  authDomain: "projectmay-358b7.firebaseapp.com",
  projectId: "projectmay-358b7",
  storageBucket: "projectmay-358b7.firebasestorage.app",
  messagingSenderId: "527237934658",
  appId: "1:527237934658:web:a6351a12ea9f9de13007db",
  measurementId: "G-VQWRV48PQF",
};

if (!getApps().length) initializeApp(firebaseConfig);

export const auth = getAuth();

/** 현재 로그인 유저의 Firebase ID 토큰 안전 획득 유틸 */
export async function getIdTokenSafe(forceRefresh = false): Promise<string | null> {
  // 이미 로그인 상태면 즉시
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch {
      return null;
    }
  }
  // 아직 사용자 로드 전이면 1회 대기
  const user = await new Promise<ReturnType<typeof auth["currentUser"]>>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });
  if (!user) return null;
  try {
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}
