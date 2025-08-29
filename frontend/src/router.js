import { jsx as _jsx } from "react/jsx-runtime";
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/Loader";
import NotFound from "@/pages/NotFound";
import { AdminRoute } from "@/components/auth/AdminRoute"; // 💡 AdminRoute import
import ReservationProcess from "@/pages/ReservationProcess";
const AuthLanding = lazy(() => import("@/pages/AuthLanding"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Home = lazy(() => import("@/pages/Home"));
const MyReservations = lazy(() => import("@/pages/MyReservation"));
const MyPage = lazy(() => import("@/pages/MyPage"));
const ReservationDetail = lazy(() => import("@/pages/ReservationDetail"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const MyPageEdit = lazy(() => import("@/pages/MyPageEdit"));
const ParentsManage = lazy(() => import("@/pages/ParentsManage"));
// const CompanionInfoPage = lazy(() => import("@/pages/CompanionInfoPage"));
export const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
export const router = createBrowserRouter([
    {
        path: "/",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(AuthLanding, {}) })),
    },
    {
        path: "/login",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(Login, {}) })),
    },
    {
        path: "/signup",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(SignUp, {}) })),
    },
    {
        path: "/admin",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(AdminRoute, {}) })),
    },
    {
        path: "/home",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(Home, {}) })),
    },
    {
        path: "/reservation",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(ReservationProcess, {}) })),
    },
    {
        path: "/my-reservation",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(MyReservations, {}) })),
    },
    {
        path: "/profile",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(MyPage, {}) })),
    },
    {
        path: "/reservation/:id",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(ReservationDetail, {}) })),
    },
    {
        path: "/chat",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(ChatPage, {}) })),
    },
    {
        path: "/profile/edit",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(MyPageEdit, {}) })),
    },
    {
        path: "/parents/manage",
        element: (_jsx(Suspense, { fallback: _jsx(Loader, { fullScreen: true }), children: _jsx(ParentsManage, {}) })),
    },
    { path: "*", element: _jsx(NotFound, {}) },
]);
