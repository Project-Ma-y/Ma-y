// src/pages/ReservationProcess.tsx
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import Step1_UserSelection from "@/components/reservation/Step1_UserSelection";
import Step2_DateTime from "@/components/reservation/Step2_DateTime"; 
import Step3_Location from "@/components/reservation/Step3_Location";
import Step4_AdditionalInfo from "@/components/reservation/Step4_AdditionalInfo";
import Step5_Confirmation from "@/components/reservation/Step5_Confirmation";
import Step6_Payment from "@/components/reservation/Step6_Payment";

// TODO: Step7_Completion 컴포넌트 생성 필요
const Step7_Completion = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">예약 완료! 🎉</h2>
      <p className="text-lg text-gray-700">성공적으로 예약되었습니다.</p>
      <div className="mt-8 w-full max-w-xs">
        <Button onClick={onNext} buttonName="홈으로" type="primary" />
      </div>
    </div>
  );
};

const steps = [
  Step1_UserSelection,
  Step2_DateTime,
  Step3_Location,
  Step4_AdditionalInfo,
  Step5_Confirmation,
  Step6_Payment,
  Step7_Completion
];

export default function ReservationProcess() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleNextStep = (data) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    if (step < steps.length) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
    }
  };

  // Step5에서 수정 버튼 클릭 시 특정 단계로 돌아가도록 함수 추가
  const handleSetStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const CurrentStepComponent = steps[step - 1];

  return (
    <MainLayout
      headerProps={{
       type: "header-a",
       title: "동행 예약하기",
      }}
    >
      <CurrentStepComponent
        formData={formData}
        onNext={step === steps.length ? () => navigate('/') : handleNextStep}
        onPrev={handlePrevStep}
        setStep={handleSetStep} // Step5를 위해 추가
      />
    </MainLayout>
  );
}
