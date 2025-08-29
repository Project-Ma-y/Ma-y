import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ReservationProcess.tsx
import { useState } from "react";
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
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-4 text-center", children: [_jsx("h2", { className: "text-3xl font-bold mb-4", children: "\uC608\uC57D \uC644\uB8CC! \uD83C\uDF89" }), _jsx("p", { className: "text-lg text-gray-700", children: "\uC131\uACF5\uC801\uC73C\uB85C \uC608\uC57D\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), _jsx("div", { className: "mt-8 w-full max-w-xs", children: _jsx(Button, { onClick: onNext, buttonName: "\uD648\uC73C\uB85C", type: "primary" }) })] }));
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
    return (_jsx(MainLayout, { headerProps: {
            type: "header-a",
            title: "동행 예약하기",
        }, children: _jsx(CurrentStepComponent, { formData: formData, onNext: step === steps.length ? () => navigate('/') : handleNextStep, onPrev: handlePrevStep, setStep: handleSetStep }) }));
}
