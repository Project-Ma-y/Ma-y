// src/components/auth/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import api from "@/lib/api"; // ✅ axios 인스턴스 import
import { AdminPage } from "@/router";

const AccessDeniedModal = ({ onConfirm }: { onConfirm: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-semibold text-red-600 mb-4">접근 권한 없음</h3>
      <p className="text-gray-700 mb-6">이 페이지에 접근할 권한이 없습니다.</p>
      <button
        onClick={onConfirm}
        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
      >
        확인
      </button>
    </div>
  </div>
);

export function AdminRoute() {
  const { isLoggedIn, isAdmin } = useAuthStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loading, setLoading] = useState(true);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      try {
        // ✅ 관리자 확인 API 호출
        const res = await api.get("/auth/checkAdmin");
        const isAdminUser = res.data?.isAdmin === true;

        setAuth({ isLoggedIn: true, isAdmin: isAdminUser });

        if (!isAdminUser) {
          setShowAccessDeniedModal(true);
        }
      } catch (error) {
        console.error("Failed to check admin status", error);
        setAuth({ isLoggedIn: false, isAdmin: false });
        setShowAccessDeniedModal(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn, setAuth]);

  const handleModalConfirm = () => {
    setShowAccessDeniedModal(false);
    window.location.href = "/";
  };

  // ✅ API 확인 중에는 아무 것도 리턴하지 않고 Spinner만
  if (loading) {
    return <Spinner size={48} />;
  }

  // ✅ 관리자면 AdminPage, 아니면 접근 거부
  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <>
      {showAccessDeniedModal && <AccessDeniedModal onConfirm={handleModalConfirm} />}
      <Navigate to="/" replace />
    </>
  );
}
