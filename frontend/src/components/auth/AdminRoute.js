import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/auth/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { AdminPage } from "@/router";
const AccessDeniedModal = ({ onConfirm }) => {
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-xl text-center", children: [_jsx("h3", { className: "text-xl font-semibold text-red-600 mb-4", children: "\uC811\uADFC \uAD8C\uD55C \uC5C6\uC74C" }), _jsx("p", { className: "text-gray-700 mb-6", children: "\uC774 \uD398\uC774\uC9C0\uC5D0 \uC811\uADFC\uD560 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx("button", { onClick: onConfirm, className: "px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition", children: "\uD655\uC778" })] }) }));
};
export function AdminRoute() {
    const { isLoggedIn, isAdmin } = useAuthStore();
    const setAuth = useAuthStore(s => s.setAuth); // ✅ 올바른 함수 이름으로 변경
    const [loading, setLoading] = useState(true);
    const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get("/api/auth/checkAdmin");
                const isAdminUser = res.data.isAdmin;
                // setLoginStatus 대신 setAuth를 사용하여 로그인 상태 업데이트
                setAuth({ isLoggedIn: true, isAdmin: isAdminUser });
                // ✅ 관리자 권한이 없으면 모달을 표시
                if (!isAdminUser) {
                    setShowAccessDeniedModal(true);
                }
            }
            catch (error) {
                console.error("Failed to check admin status", error);
                // 에러 발생 시에도 setAuth를 사용하여 로그인 상태를 false로 설정
                setAuth({ isLoggedIn: false, isAdmin: false });
                // ✅ 에러 발생 시에도 모달을 표시
                setShowAccessDeniedModal(true);
            }
            finally {
                setLoading(false);
            }
        };
        checkAdminStatus();
    }, [isLoggedIn, setAuth]); // useEffect의 의존성 배열에 setAuth 추가
    const handleModalConfirm = () => {
        setShowAccessDeniedModal(false);
        // 홈 페이지로 리디렉션
        window.location.href = "/";
    };
    if (loading) {
        return _jsx(Spinner, { size: 48 });
    }
    // ✅ isAdmin이 true일 때 AdminPage 컴포넌트를 렌더링
    return isAdmin ? (_jsx(AdminPage, {})) : (_jsxs(_Fragment, { children: [showAccessDeniedModal && _jsx(AccessDeniedModal, { onConfirm: handleModalConfirm }), _jsx(Navigate, { to: "/", replace: true })] }));
}
