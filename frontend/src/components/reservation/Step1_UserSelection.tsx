import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";

interface Step1Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step1_UserSelection: React.FC<Step1Props> = ({ formData, onNext, onPrev }) => {
  const [selectedUser, setSelectedUser] = useState(formData.selectedUser || null);

  // TODO: 실제 유저 데이터는 API를 통해 가져와야 합니다.
  const users = [
    { id: '1', name: "김순자", relation: "어머니", phone: "010-1234-5678" },
    { id: '2', name: "홍길동", relation: "아버지", phone: "010-1234-5678" }
  ];

  const handleUserSelect = (user) => {
    setSelectedUser(user.id);
  };

  const handleNextClick = () => {
    if (selectedUser) {
      onNext({ selectedUser: selectedUser });
    } else {
      // alert() 대신 커스텀 모달 사용
      console.log("사용자를 선택해주세요.");
    }
  };

  // onPrev는 Step1에서 사용되지 않으므로, ReservationProcess에서 뒤로가기 버튼 로직을 변경해야 합니다.

  return (
    <div className="p-0 space-y-4">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">동행이 필요한 분은 누구인가요?</h2>
        <div className="space-y-3">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`w-full text-left rounded-lg border-2 p-3 ${
                selectedUser === user.id ? 'border-blue-500' : 'border-gray-200'
              } hover:border-blue-400 transition-colors`}
              aria-label={`${user.name} 선택`}
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
                      {user.name}
                      <span className="text-xs text-gray-500 font-normal">m</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.relation} | 전화번호 {user.phone}
                    </div>
                  </div>
                </div>
                {selectedUser === user.id && (
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between p-4 bg-gray-50">
        <Button onClick={() => console.log('수정 기능 구현 필요')} buttonName="수정하기" type="secondary" />
        <Button onClick={handleNextClick} buttonName="다음" type="primary" disabled={!selectedUser} />
      </div>
    </div>
  );
};

export default Step1_UserSelection;
