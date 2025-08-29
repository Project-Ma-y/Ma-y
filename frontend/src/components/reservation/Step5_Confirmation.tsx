// src/components/reservation/Step5_Confirmation.tsx
import React, { useMemo } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import { useUserStore } from "@/store/userStore";
import Modal from "@/components/Modal";
import { createBooking } from "@/services/bookingApi";
import { toISO } from "@/utils/datetime";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { getAuth } from "firebase/auth";
import { api } from "@/lib/api";

interface Step5Props {
  formData: any;
  onNext: (data?: any) => void;
  onPrev: () => void;
  setStep: (step: number) => void;
}

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];

const formatYMDWeek = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = weekdayKo[d.getDay()];
  return `${y}년 ${m}월 ${day}일 ${w}요일`;
};

const mapAssistance = (types: string[] = []) => {
  const label: Record<string, string> = {
    guide: "길안내 및 이동 보조",
    admin: "접수 및 행정 보조",
    shopping: "장보기 보조",
    other: "기타",
  };
  return types.map(t => label[t] || t).join(", ");
};

const Step5_Confirmation: React.FC<Step5Props> = ({ formData, onNext, onPrev, setStep }) => {
  const { profile } = useUserStore();
  const navigate = useNavigate();
  const ui = useUIStore();

  // 예약자(로그인 사용자) 정보
  const reserver = useMemo(() => {
    return {
      name: profile?.name ?? profile?.registeredFamily?.[0]?.name ?? "이름없음",
      phone: profile?.phone ?? profile?.registeredFamily?.[0]?.phoneNumber ?? "",
    };
  }, [profile]);

  // Step1에서 저장한 스냅샷 사용
  const selectedUser = formData?.selectedUser || null;

  const dateLine = formatYMDWeek(formData?.selectedDate);
  const timeLine =
    formData?.startTime && formData?.endTime
      ? `${formData.startTime} ~ ${formData.endTime}`
      : "";

        // 예약 제출 핸들러
  const handleReserve = async () => {
    // formData → 백엔드 스키마 변환
    const startISO = toISO(formData?.selectedDate, formData?.startTime);
    const endISO   = toISO(formData?.selectedDate, formData?.endTime);

    // assistanceType은 단일 문자열로 보냄(여러 개라면 첫 번째, 없으면 'other')
    const assistanceType =
      Array.isArray(formData?.assistanceTypes) && formData.assistanceTypes.length > 0
        ? formData.assistanceTypes[0]
        : "other";

    const payload = {
      startBookingTime: startISO,
      endBookingTime: endISO,
      departureAddress: formData?.departureAddress || "",
      destinationAddress: formData?.destinationAddress || "",
      roundTrip: !!formData?.roundTrip,
      assistanceType,
      additionalRequests: formData?.additionalRequests || "",
    };

    const u = getAuth().currentUser;
    const t = u ? await u.getIdToken() : "";
    console.debug("[reserve] token head:", t ? t.slice(0, 12) + "…" : "(no user)");
    console.debug("[reserve] api.baseURL=", api.defaults.baseURL, "withCredentials=", api.defaults.withCredentials);
    try {
      const { bookingId } = await createBooking(payload);
      // 성공 모달
      ui.openModal("reserve-success");
      // 필요시 페이지 이동
      // navigate(`/reservation/${bookingId}`);
    } catch (e) {
      console.error("[createBooking error]", e);
      ui.openModal("reserve-fail");
    }
  };

  return (
    <Card className="p-0">
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold mb-1">입력하신 내용이 맞나요?</h2>
        <p className="text-sm text-yellow-500">안심하고 이용하실 수 있도록 정보들을 다시 한 번 확인해주세요.</p>

        {/* 예약자 정보 */}
        <div className="border-b pb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">예약하시는 분</h3>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
              </svg>
            </span>
            <div>
              <div className="font-bold flex items-center gap-1">{reserver.name}</div>
              <div className="text-sm text-gray-500">{reserver.phone}</div>
            </div>
          </div>
        </div>

        {/* 동행이 필요한 분 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">동행이 필요한 분</h3>
            {selectedUser ? (
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                  </svg>
                </span>
                <div>
                  <div className="font-bold">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedUser.relation} | 전화번호 {selectedUser.phone || "없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">선택된 보호 대상자가 없습니다.</div>
            )}
          </div>
          <button onClick={() => setStep(1)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 일시 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">일시</h3>
            <p className="font-medium">
              {dateLine && <>{dateLine}<br/></>}
              {timeLine}
            </p>
          </div>
          <button onClick={() => setStep(2)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 장소 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">장소</h3>
            <p className="font-medium">
              출발지 : {formData?.departureAddress || "-"}<br/>
              목적지 : {formData?.destinationAddress || "-"}
            </p>
          </div>
          <button onClick={() => setStep(3)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 추가 정보 */}
        <div className="flex justify-between items-center pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">추가 정보</h3>
            <p className="font-medium">
              {formData?.roundTrip ? "왕복" : "편도"}<br/>
              {mapAssistance(formData?.assistanceTypes)}
              {formData?.additionalRequests && (
                <>
                  <br />{formData.additionalRequests}
                </>
              )}
            </p>
          </div>
          <button onClick={() => setStep(4)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>
      </div>

      <div className="flex justify-center p-4 bg-gray-50 border-t">
        <Button
          onClick={() => ui.openModal("reserve-confirm")}
          buttonName="예약하기"
          type="primary"
        />
      </div>

      {/* 확인 모달 → 확인 시 실제 POST */}
      <Modal
        id="reserve-confirm"
        variant="notice"
        title="예약을 진행할까요?"
        subtext="입력한 정보로 예약을 생성합니다."
        confirmText="예, 예약하기"
        showCancel
        cancelText="수정할게요"
        onConfirm={handleReserve}
        acknowledgeLabel="안내사항을 확인했습니다."
      >
        <p className="text-sm leading-6">
          결제 및 예약 확정 절차는 안내에 따라 진행됩니다.
        </p>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        id="reserve-success"
        variant="success"
        title="예약이 완료되었습니다"
        subtext="내 예약에서 상세를 확인할 수 있어요."
        confirmText="내 예약 보기"
        onConfirm={() => navigate("/my-reservation")}
      />

      {/* 실패 모달 */}
      <Modal
        id="reserve-fail"
        variant="warning"
        title="예약에 실패했습니다"
        subtext="네트워크 또는 인증 상태를 확인한 뒤 다시 시도해주세요."
        confirmText="확인"
      />
    </Card>
  );
};

export default Step5_Confirmation;
