import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import { useUIStore } from "@/store/uiStore";
import { Modal } from "@/components/Modal";
const Step6_Payment = ({ formData, onNext, onPrev }) => {
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
    return (_jsxs(Card, { className: "p-0", children: [_jsxs("div", { className: "p-4 space-y-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uACB0\uC81C \uCE74\uB4DC" }), _jsx("div", { className: "w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold", children: "\uACB0\uC81C \uCE74\uB4DC \uC774\uBBF8\uC9C0" }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uACB0\uC81C \uB0B4\uC6A9" }), _jsxs("div", { className: "space-y-2 text-gray-700", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "\uB3D9\uD589 \uBE44\uC6A9" }), _jsx("span", { children: "10,000 \uC6D0" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "\uC218\uC218\uB8CC" }), _jsx("span", { children: "1,000 \uC6D0" })] }), _jsxs("div", { className: "flex justify-between font-bold text-lg mt-4", children: [_jsx("span", { children: "\uACB0\uC81C \uAE08\uC561" }), _jsx("span", { children: "14,000 \uC6D0" })] })] })] })] }), _jsxs("div", { className: "flex justify-between p-4 bg-gray-50 border-t", children: [_jsx(Button, { onClick: onPrev, buttonName: "\uC774\uC804", type: "secondary" }), _jsx(Button, { onClick: handleNextClick, buttonName: "\uACB0\uC81C\uD558\uAE30", type: "primary" })] }), _jsx(Modal, { id: MODAL_ID, variant: "notice", title: "\uAC1C\uBC1C \uC911\uC778 \uC11C\uBE44\uC2A4\uC785\uB2C8\uB2E4.", subtext: "\uD604\uC7AC \uD14C\uC2A4\uD2B8 \uB2E8\uACC4\uC774\uBA70, \uC2E4\uC81C\uB85C \uC81C\uACF5\uD558\uB294 \uC11C\uBE44\uC2A4\uAC00 \uC544\uB2D9\uB2C8\uB2E4.", acknowledgeLabel: "\uC704 \uC548\uB0B4 \uC0AC\uD56D\uC744 \uC219\uC9C0\uD588\uC2B5\uB2C8\uB2E4.", confirmText: "\uD655\uC778", onConfirm: handleModalConfirm })] }));
};
export default Step6_Payment;
