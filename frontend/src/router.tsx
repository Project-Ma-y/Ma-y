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
const MyPage = lazy(() => import("@/pages/Mypage"));
const ReservationDetail = lazy(() => import("@/pages/ReservationDetail"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const MyPageEdit = lazy(() => import("@/pages/MyPageEdit"));
const ParentsManage = lazy(() => import("@/pages/ParentsManage"));
// const CompanionInfoPage = lazy(() => import("@/pages/CompanionInfoPage"));
export const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));


export const router = createBrowserRouter([
  {
    path: "/",
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
  {
    path: "/admin",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <AdminRoute />
      </Suspense>
    ),
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/reservation",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <ReservationProcess />
      </Suspense>
    ),
  },
  {
    path: "/my-reservation",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <MyReservations />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: "/reservation/:id",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <ReservationDetail />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <ChatPage />
      </Suspense>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <MyPageEdit />
      </Suspense>
    ),
  },
  {
  path: "/parents/manage",
  element:  (
      <Suspense fallback={<Loader fullScreen />}>
        <ParentsManage/>
      </Suspense>
    ),
},
  { path: "*", element: <NotFound /> },
]);
