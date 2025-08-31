// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/Loader";
import NotFound from "@/pages/NotFound";
import { AdminRoute } from "@/components/auth/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // ✅ 추가
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
export const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const ManagerProfile = lazy(() => import("@/pages/ManagerProfile"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));

export const router = createBrowserRouter([
  // ✅ 첫 화면: 홈
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <Home />
      </Suspense>
    ),
  },

  // ✅ 로그인/회원가입 선택 랜딩
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthLanding />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loader />}>
        <SignUp />
      </Suspense>
    ),
  },

  // ✅ Admin 보호 라우트(기존 유지)
  {
    path: "/admin",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <AdminRoute />
      </Suspense>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <AdminRoute />
      </Suspense>
    ),
  },

  // ✅ 로그인 필요 라우트들
  {
    path: "/reservation",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <ReservationProcess />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservation/:id",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <ReservationDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-reservation",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <MyReservations />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <MyPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <MyPageEdit />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/parents/manage",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <ParentsManage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader fullScreen />}>
          <ChatPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
{
  path: "/profile/:id",
  element: (
    <Suspense fallback={<Loader fullScreen />}>
      <ManagerProfile />
    </Suspense>
  ),
},
  { path: "*", element: <NotFound /> },
]);
