// src/pages/MyPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import ReservationCard from "@/components/ReservationCard";
import clsx from "clsx";
import { getAuth, signOut } from "firebase/auth";

const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";

type ReservationCardStatus = "reserved" | "ongoing" | "finished";

interface Reservation {
  _id: string;
  userId: string;
  familyId?: string;
  seniorId?: string;
  startBookingTime: string;
  endBookingTime: string;
  departureAddress: string;
  destinationAddress: string;
  roundTrip: boolean;
  assistanceType: "guide" | "admin" | "shopping" | "other";
  additionalRequests?: string;
  userType: "family" | "senior";
  status: "pending" | "completed" | "cancelled";
  price: number;
  isPaid: boolean;
  paymentMethod?: "card" | "cash" | "transfer";
  paidAt?: string;
}

const mapStatusToCardStatus = (apiStatus: Reservation["status"]): ReservationCardStatus => {
  switch (apiStatus) {
    case "pending":
      return "reserved";
    case "completed":
    case "cancelled":
      return "finished";
    default:
      return "reserved";
  }
};

const formatDateToText = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "유효하지 않은 날짜";

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let prefix = "";
  if (date.toDateString() === today.toDateString()) prefix = "오늘";
  else if (date.toDateString() === tomorrow.toDateString()) prefix = "내일";
  else prefix = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "오후" : "오전";
  const hh = h % 12 === 0 ? 12 : h % 12;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${prefix} ${ampm} ${hh}:${mm}`;
};

export default function MyPage() {
  const navigate = useNavigate();
  const {
    profile,
    isLoggedIn,
    isUserLoading,
    isProfileLoading,
    fetchUserProfile,
  } = useUserStore();

  // 보호대상자 관리 페이지로 초기값 전달
  const openParentsManage = () => {
    if (!profile) return;
    const prefill = (profile.registeredFamily ?? []).map((p: any) => ({
      mid: p.memberId,                 // 서버 식별자
      name: p.name ?? "",
      phone: p.phone ?? "",
      gender: p.gender ?? "",
      birthdate: p.birthdate ?? "",
      relation: p.relation ?? "",
    }));
    navigate("/parents/manage", { state: { parents: prefill } });
  };

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isResLoading, setIsResLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoggedIn) {
      const run = async () => {
        setIsResLoading(true);
        try {
          const auth = getAuth();
          const current = auth.currentUser;
          if (!current) {
            setReservations([]);
            return;
          }
          const token = await current.getIdToken();
          const resp = await fetch(`${BASE_URL}/my`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!resp.ok) {
            setReservations([]);
            return;
          }
          const data: Reservation[] = await resp.json();
          const sorted = data.sort(
            (a, b) =>
              new Date(b.startBookingTime).getTime() - new Date(a.startBookingTime).getTime()
          );
          setReservations(sorted);
        } catch {
          setReservations([]);
        } finally {
          setIsResLoading(false);
        }
      };
      run();
    } else {
      setReservations([]);
      setIsResLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !profile && !isProfileLoading) {
      fetchUserProfile();
    }
  }, [isLoggedIn, profile, isProfileLoading, fetchUserProfile]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const recentReservation = useMemo(() => reservations[0], [reservations]);

  const menuItems = [
    { label: "함께한 동행인", path: "/accompanying-partners" },
    { label: "문의 내역", path: "/inquiries" },
    { label: "결제 수단 관리", path: "/payment-methods" },
  ];

  const guideItems = [
    { label: "공지사항", path: "/announcements" },
    { label: "웹 버전", version: "1.0.0 (beta)" },
  ];

  const renderProfile = () => {
    if (isUserLoading || isProfileLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700">정보를 불러오는 중...</p>
        </div>
      );
    }

    if (!isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700">로그인이 필요합니다.</p>
          <Link to="/login" className="mt-4 text-blue-500 hover:underline">
            로그인하기
          </Link>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-red-500">프로필 정보를 불러오지 못했습니다.</p>
        </div>
      );
    }

    // 사용자 이름은 항상 사용자 본인의 이름
    const profileName = profile.name;
    const isGuardian =
      profile.role === "guardian" || profile.customerType === "family";

    // 보호대상자(가족) 리스트
    const familyList: any[] = Array.isArray(profile.registeredFamily) ? profile.registeredFamily : [];
    const hasRegisteredFamily = familyList.length > 0;

    return (
      <>
        <Card className="flex items-center gap-4 p-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <svg
                className="h-10 w-10 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
              </svg>
            )}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{profileName}</h3>
              <span className="rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">
                {isGuardian ? "보호자" : "회원"}
              </span>
              <Link
                to="/profile/edit"
                className="flex items-center text-gray-500 ml-auto cursor-pointer text-sm"
              >
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
            <div className="text-sm text-gray-500 mt-1">{profile.phone}</div>
            <div className="text-xs text-gray-500 mt-1">
              {hasRegisteredFamily
                ? `보호 대상자 - ${familyList.length}명`
                : "보호 대상자 없음"}
            </div>
          </div>
        </Card>

        {hasRegisteredFamily && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-700">
                보호 대상자 ({familyList.length}명)
              </div>
              <button onClick={openParentsManage}>
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
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

            {familyList.map((parent: any, index: number) => (
              <Link to="#" key={index}>
                <Card className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sm font-bold">
                          {parent.name}
                        </span>
                        <span className="rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                          {parent.gender === "male"
                            ? "M"
                            : parent.gender === "female"
                            ? "F"
                            : ""}
                        </span>
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {parent.phone}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-700">
              이용 현황 ({reservations.length}건)
            </div>
            <button
              className="text-xs text-gray-500 underline"
              onClick={() => navigate("/my-reservation")}
            >
              전체 보기
            </button>
          </div>

          {isResLoading ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-gray-500">예약 정보를 불러오는 중...</p>
            </div>
          ) : recentReservation ? (
            <ReservationCard
              id={recentReservation._id}
              status={mapStatusToCardStatus(recentReservation.status)}
              dateText={formatDateToText(recentReservation.startBookingTime)}
              title={`${recentReservation.destinationAddress} 방문`}
              companionText={"김이박 동행인"}
              onConfirm={() => navigate(`/reservation/${recentReservation._id}`)}
              onCancel={() => navigate(`/reservation/${recentReservation._id}`)}
            />
          ) : (
            <Card className="p-4">
              <div className="text-sm text-gray-600">
                최근 예약이 없습니다. 첫 예약을 진행해보세요.
              </div>
              <button
                className="mt-3 text-sm font-semibold text-[var(--color-primary)] underline"
                onClick={() => navigate("/reservation")}
              >
                동행 예약 바로가기
              </button>
            </Card>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="block">
              <div className="flex items-center justify-between border-b border-gray-200 py-4">
                <span className="text-base font-semibold text-gray-700">
                  {item.label}
                </span>
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

        <div className="mt-6 space-y-3">
          <div className="text-sm font-semibold text-gray-700">가이드</div>
          {guideItems.map((item, index) => (
            <div
              key={index}
              className={clsx("flex items-center justify-between py-4", {
                "border-b border-gray-200": item.path,
              })}
            >
              {item.path ? (
                <Link to={item.path} className="flex-1">
                  <span className="text-base font-semibold text-gray-700">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="flex-1 text-base font-semibold text-gray-700">
                  {item.label}
                </span>
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
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center border-b border-gray-200 py-4 text-base font-semibold text-gray-700 hover:text-red-500 transition-colors duration-200"
          >
            로그아웃
          </button>
        </div>
      </>
    );
  };

  return (
    <MainLayout
      headerProps={{
        title: "내 정보",
        showBack: false,
        right: (
          <div className="flex items-center gap-2">
            <button aria-label="알림">
              <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
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
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-2.83 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-.09a1 1 0 0 0-1-.19 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0L3.5 17.5a2 2 0 0 1 0-2.83l.06-.06a1 1 0 0 0 .33-1.82v-.09a1 1 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-1.9a2 2 0 0 1 2-2h.09a1 1 0 0 0 .19-1 1 1 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83L6.5 3.5a2 2 0 0 1 2.83 0l.06.06a1 1 0 0 0 1.82.33H12a2 2 0 0 1 2 2v.09a1 1 0 0 0 1 .19 1 1 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83l-.06.06a1 1 0 0 0-.33 1.82v.09a1 1 0 0 0 1.51 1H21a2 2 0 0 1 2 2v1.9a2 2 0 0 1-2 2h-.09a1 1 0 0 0-.19 1Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        ),
      }}
      showNav={true}
    >
      <div className="">{renderProfile()}</div>
    </MainLayout>
  );
}
