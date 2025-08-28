import React, { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import ReservationCard from "@/components/ReservationCard";
import { useUserStore } from "@/store/userStore";
import { ENDPOINTS } from "@/lib/endpoints";
import { getAuth, signOut } from "firebase/auth";

// 관계를 한글로 변환하는 헬퍼 함수
const getRelationInKorean = (relation) => {
  switch (relation) {
    case "father":
      return "아버지";
    case "mother":
      return "어머니";
    case "son":
    case "daughter":
      return "자녀";
    default:
      return "관계 불명";
  }
};

export default function MyPage() {
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn, setUser, logout } = useUserStore();

  const recentReservation = {
    status: "finished",
    dateText: "내일 오전 10:00",
    title: "서울 아산병원 방문",
    companionText: "ㅇㅇㅇ 동행인",
  };

  const menuItems = [
    { label: "함께한 동행인", path: "/accompanying-partners" },
    { label: "문의 내역", path: "/inquiries" },
    { label: "결제 수단 관리", path: "/payment-methods" },
  ];

  const guideItems = [
    { label: "공지사항", path: "/announcements" },
    { label: "웹 버전", version: "1.0.0 (beta)" },
  ];

  // 인증 상태 로딩 중일 때 로딩 화면을 보여줍니다.
  if (isLoading) {
    return (
      <MainLayout headerProps={{ title: "내정보" }} showNav={true}>
        <div className="p-4 text-center text-gray-500">
          사용자 정보를 불러오는 중입니다...
        </div>
      </MainLayout>
    );
  }

  // 로그아웃 상태일 때 로그인 페이지로 리디렉션합니다.
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // 실제 사용자 데이터가 없을 때의 예외 처리
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    logout();
    navigate('/login');
  };

  const profileName = user.customerType === "family" ? user.name : user.registeredFamily?.[0]?.name;
  const hasRegisteredFamily = user.registeredFamily && user.registeredFamily.length > 0;

  return (
    <MainLayout
      headerProps={{
        title: "내정보",
        showBack: false,
        right: (
          <div className="flex items-center gap-2">
            <button aria-label="알림">
              <svg
                className="h-6 w-6 text-gray-800"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" />
              </svg>
            </button>
            <button aria-label="설정">
              <svg
                className="h-6 w-6 text-gray-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-2.83 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-.19 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0L3.5 17.5a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-1.9a2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 .19-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83L6.5 3.5a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H12a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 .19 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2v1.9a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-.19 1Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        ),
      }}
      showNav={true}
    >
      <Card className="flex items-center gap-4 p-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <svg className="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
          </svg>
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{profileName || user.name}</h3>
            <span className="rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">
              {user.customerType === "family" ? "보호자" : "어르신"}
            </span>
            <Link to="/profile/edit" className="flex items-center text-gray-500 ml-auto cursor-pointer text-sm">
              <span className="mr-1">수정하기</span>
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
              </svg>
            </Link>
          </div>
          <div className="text-sm text-gray-500 mt-1">{user.phone}</div>
          <div className="text-xs text-gray-500 mt-1">
            {hasRegisteredFamily ? `보호 대상자 - ${user.registeredFamily.length}명` : "보호 대상자 없음"}
          </div>
        </div>
      </Card>

      {/* 보호 대상자 섹션 (registeredFamily가 있을 때만 렌더링) */}
      {hasRegisteredFamily && (
        <div className="mt-6 space-y-3">
          <div className="text-sm font-semibold text-gray-700">보호 대상자 ({user.registeredFamily.length}명)</div>
          {user.registeredFamily.map((guardian, index) => (
            <Link to="#" key={index}>
              <Card className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-bold">{guardian.name}</span>
                      <span className="rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">
                        {getRelationInKorean(guardian.relation)}
                      </span>
                    </div>
                    <div className="truncate text-xs text-gray-500">{guardian.uid}</div>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* 이용 현황 섹션 */}
      <div className="mt-6 space-y-3">
        <div className="text-sm font-semibold text-gray-700">이용 현황 (1건)</div>
        <ReservationCard
          status={recentReservation.status}
          dateText={recentReservation.dateText}
          title={recentReservation.title}
          companionText={recentReservation.companionText}
        />
      </div>

      {/* 메뉴 리스트 섹션 */}
      <div className="mt-6 space-y-3">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} className="block">
            <div className="flex items-center justify-between border-b border-gray-200 py-4">
              <span className="text-base font-semibold text-gray-700">{item.label}</span>
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 가이드 및 버전 정보 섹션 */}
      <div className="mt-6 space-y-3">
        <div className="text-sm font-semibold text-gray-700">가이드</div>
        {guideItems.map((item, index) => (
          <div key={index} className={clsx("flex items-center justify-between py-4", {
            "border-b border-gray-200": item.path
          })}>
            {item.path ? (
              <Link to={item.path} className="flex-1">
                <span className="text-base font-semibold text-gray-700">{item.label}</span>
              </Link>
            ) : (
              <span className="flex-1 text-base font-semibold text-gray-700">{item.label}</span>
            )}
            {item.version ? (
              <span className="text-sm text-gray-400">{item.version}</span>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>
        ))}
        {/* 로그아웃 버튼 추가 */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between py-4 text-left border-b border-gray-200"
        >
          <span className="text-base font-semibold text-gray-700">로그아웃</span>
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </MainLayout>
  );
}
