import React, { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import { useUIStore } from "@/store/uiStore";
import { Modal } from "@/components/Modal";

interface Step6Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step6_Payment: React.FC<Step6Props> = ({ formData, onNext, onPrev }) => {
  const openModal = useUIStore(s => s.openModal);
  const closeModal = useUIStore(s => s.closeModal);

  // 모달을 제어하기 위한 ID
  const MODAL_ID = "service-notice-modal";

  // 컴포넌트 마운트 시 모달 열기
  useEffect(() => {
    openModal(MODAL_ID);
    return () => {
      closeModal(MODAL_ID);
    };
  }, [openModal, closeModal]);

  const handleNextClick = () => {
    onNext({});
  };

  const handleModalConfirm = () => {
    closeModal(MODAL_ID);
  };

  return (
    <Card className="p-0">
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold mb-4">결제 카드</h2>
        {/* 결제 카드 영역 (임시) */}
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold">
          결제 카드 이미지
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-base font-semibold text-gray-800 mb-3">결제 내용</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>동행 비용</span>
              <span>10,000 원</span>
            </div>
            <div className="flex justify-between">
              <span>수수료</span>
              <span>1,000 원</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>결제 금액</span>
              <span>14,000 원</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between p-4 bg-gray-50 border-t">
        <Button onClick={onPrev} buttonName="이전" type="secondary" />
        <Button onClick={handleNextClick} buttonName="결제하기" type="primary" />
      </div>

      {/* 개발 중인 서비스 모달 */}
      <Modal
        id={MODAL_ID}
        variant="notice"
        title="개발 중인 서비스입니다."
        subtext="현재 테스트 단계이며, 실제로 제공하는 서비스가 아닙니다."
        acknowledgeLabel="위 안내 사항을 숙지했습니다."
        confirmText="확인"
        onConfirm={handleModalConfirm}
      />
    </Card>
  );
};

export default Step6_Payment;
