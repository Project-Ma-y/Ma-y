import React from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";

interface Step5Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
  setStep: (step: number) => void; // ReservationProcess에서 step을 직접 변경하기 위한 prop 추가
}

const Step5_Confirmation: React.FC<Step5Props> = ({ formData, onNext, onPrev, setStep }) => {
  // TODO: 실제 유저, 보호자, 예약자 정보는 formData에서 관리되어야 합니다.
  const myInfo = {
    name: "김자영",
    phone: "010-1111-2222",
  };

  const selectedUser = {
    id: formData.selectedUser,
    name: "김순자",
    relation: "어머니",
    phone: "010-1234-5678",
  };

  const handleEditClick = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const formatAssistanceTypes = (types: string[]) => {
    const typeMap = {
      "guide": "길안내 및 이동 보조",
      "admin": "접수 및 행정 보조",
      "shopping": "장보기 보조",
      "other": "기타",
    };
    return types.map(type => typeMap[type] || type).join(", ");
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
              <div className="font-bold flex items-center gap-1">
                {myInfo.name}
              </div>
              <div className="text-sm text-gray-500">
                {myInfo.phone}
              </div>
            </div>
          </div>
        </div>

        {/* 동행이 필요한 분 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">동행이 필요한 분</h3>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                </svg>
              </span>
              <div>
                <div className="font-bold">{selectedUser.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedUser.relation} | 전화번호 {selectedUser.phone}
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => handleEditClick(1)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 일시 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">일시</h3>
            <p className="font-medium">
              2025년 7월 10일 화요일<br/>
              {formData.startTime} ~ {formData.endTime}
            </p>
          </div>
          <button onClick={() => handleEditClick(2)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 장소 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">장소</h3>
            <p className="font-medium">
              출발지 : {formData.departureAddress}<br/>
              목적지 : {formData.destinationAddress}
            </p>
          </div>
          <button onClick={() => handleEditClick(3)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>

        {/* 추가 정보 */}
        <div className="flex justify-between items-center pb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">추가 정보</h3>
            <p className="font-medium">
              {formData.roundTrip ? "왕복" : "편도"}<br/>
              {formatAssistanceTypes(formData.assistanceTypes)}
              {formData.additionalRequests && <><br/>{formData.additionalRequests}</>}
            </p>
          </div>
          <button onClick={() => handleEditClick(4)} className="text-blue-500 text-sm font-medium">수정</button>
        </div>
      </div>
      
      <div className="flex justify-center p-4 bg-gray-50 border-t">
        <Button onClick={onNext} buttonName="결제하기" type="primary" />
      </div>
    </Card>
  );
};

export default Step5_Confirmation;
