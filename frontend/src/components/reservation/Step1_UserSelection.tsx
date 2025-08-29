// src/components/reservation/Step1_UserSelection.tsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button/Button";
import { useUserStore } from "@/store/userStore";

interface Step1Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step1_UserSelection: React.FC<Step1Props> = ({ formData, onNext, onPrev }) => {
  const { profile } = useUserStore();

  const parents: any[] = useMemo(() => profile?.registeredFamily ?? [], [profile]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    const idx = formData?.selectedUserIndex;
    return typeof idx === "number" && idx >= 0 && idx < parents.length ? idx : null;
  });

  useEffect(() => {
    if (parents.length === 0) {
      onNext({ selectedUserIndex: null, selectedUser: null });
    }
  }, [parents.length, onNext]);

  const handleSelect = (idx: number) => setSelectedIndex(idx);

  const handleNext = () => {
    if (selectedIndex === null) return;
    const picked = parents[selectedIndex];

    // 🔹 Step5에서 그대로 쓸 수 있는 스냅샷 형태로 저장
    const snapshot = {
      name: picked.nickname || picked.name || "이름없음",
      phone: picked.phone || "",
      relation: picked.relation || "관계 미입력",
      // 필요하면 표시 전용 추가 필드
      birthdate: picked.birthdate || "",
      // raw도 함께 보관하고 싶으면 아래 주석 해제
      // raw: picked,
    };

    onNext({ selectedUserIndex: selectedIndex, selectedUser: snapshot });
  };

  if (parents.length === 0) return null;

  return (
    <div className="p-0 space-y-4">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">동행이 필요한 분은 누구인가요?</h2>
        <div className="space-y-3">
          {parents.map((p, idx) => {
            const active = selectedIndex === idx;
            return (
              <button
                key={`${p.phoneNumber || "no-phone"}-${idx}`}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left rounded-lg border-2 p-3 ${
                  active ? "border-blue-500" : "border-gray-200"
                } hover:border-blue-400 transition-colors`}
                aria-label={`${p.nickname || p.name || "이름없음"} 선택`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        {p.nickname || p.name || "이름없음"}
                        <span className="text-xs text-gray-500 font-normal">m</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {(p.relation || "관계 미입력")} | {(p.phoneNumber || "전화번호 없음")}
                      </div>
                    </div>
                  </div>
                  {active && (
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between p-4 bg-gray-50">
        <Button onClick={() => console.log("수정 기능 구현 필요")} buttonName="수정하기" type="secondary" />
        <Button onClick={handleNext} buttonName="다음" type="primary" disabled={selectedIndex === null} />
      </div>
    </div>
  );
};

export default Step1_UserSelection;
