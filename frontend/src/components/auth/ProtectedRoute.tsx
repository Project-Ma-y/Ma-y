// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/Loader";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth as firebaseAuth } from "@/services/firebase";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const [init, setInit] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setInit(false);
    });
    return () => unsub();
  }, []);

  if (init) return <Loader fullScreen />;

  if (!user) {
    // 비로그인 → /auth 로 이동 (이전 경로 기억)
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
