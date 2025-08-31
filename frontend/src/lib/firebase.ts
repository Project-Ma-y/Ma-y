// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

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

/** 최초 진입 시, Firebase가 현재 사용자 로드를 끝낼 때까지 1회 대기 */
export function waitForAuthInit(): Promise<User | null> {
  if (auth.currentUser !== null) return Promise.resolve(auth.currentUser);
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });
}

/** 안전한 ID 토큰 획득 */
export async function getIdTokenSafe(forceRefresh = false): Promise<string | null> {
  const u = auth.currentUser ?? (await waitForAuthInit());
  if (!u) return null;
  try {
    return await u.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}
