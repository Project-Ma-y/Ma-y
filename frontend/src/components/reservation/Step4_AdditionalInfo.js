import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Button from "@/components/button/Button";
import Radio from "@/components/Radio";
import Checkbox from "@/components/Checkbox";
const Step4_AdditionalInfo = ({ formData, onNext, onPrev }) => {
    const [isRoundTrip, setIsRoundTrip] = useState(formData.roundTrip || false);
    const [assistanceTypes, setAssistanceTypes] = useState(formData.assistanceTypes || []);
    const [additionalRequests, setAdditionalRequests] = useState(formData.additionalRequests || "");
    const handleAssistanceTypeChange = (type, checked) => {
        if (checked) {
            setAssistanceTypes([...assistanceTypes, type]);
        }
        else {
            setAssistanceTypes(assistanceTypes.filter(t => t !== type));
        }
    };
    const handleNextClick = () => {
        onNext({
            roundTrip: isRoundTrip,
            assistanceTypes: assistanceTypes,
            additionalRequests: additionalRequests,
        });
    };
    return (_jsxs("div", { className: "p-0", children: [_jsxs("div", { className: "p-4 space-y-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uBA87 \uAC00\uC9C0\uB9CC \uB354 \uC5EC\uCB64\uBCFC\uAC8C\uC694!" }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uD568\uAED8 \uB3CC\uC544\uC624\uAE38 \uC6D0\uD558\uC2DC\uB098\uC694?" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Radio, { name: "roundTrip", checked: !isRoundTrip, onChange: () => setIsRoundTrip(false), children: "\uC544\uB2C8\uC624! \uAC08 \uB54C\uB9CC \uB3D9\uD589\uC774 \uD544\uC694\uD574\uC694 (\uD3B8\uB3C4)" }), _jsx(Radio, { name: "roundTrip", checked: isRoundTrip, onChange: () => setIsRoundTrip(true), children: "\uB124! \uB3CC\uC544\uC62C \uB54C\uB3C4 \uD568\uAED8\uD574\uC8FC\uC138\uC694. (\uC655\uBCF5)" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uC5B4\uB5A4 \uB3C4\uC6C0\uC774 \uD544\uC694\uD558\uC2E0\uAC00\uC694?" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Checkbox, { checked: assistanceTypes.includes("guide"), onChange: (checked) => handleAssistanceTypeChange("guide", checked), children: "\uAE38\uC548\uB0B4 \uBC0F \uC774\uB3D9 \uBCF4\uC870" }), _jsx(Checkbox, { checked: assistanceTypes.includes("admin"), onChange: (checked) => handleAssistanceTypeChange("admin", checked), children: "\uC811\uC218 \uBC0F \uD589\uC815 \uBCF4\uC870 (\uC740\uD589, \uAD00\uACF5\uC11C \uB4F1)" }), _jsx(Checkbox, { checked: assistanceTypes.includes("shopping"), onChange: (checked) => handleAssistanceTypeChange("shopping", checked), children: "\uC7A5\uBCF4\uAE30 \uBCF4\uC870 (\uB9C8\uD2B8, \uC2DC\uC7A5 \uAC00\uC2E4 \uB54C)" }), _jsx(Checkbox, { checked: assistanceTypes.includes("other"), onChange: (checked) => handleAssistanceTypeChange("other", checked), children: "\uAE30\uD0C0" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: ["\uCD94\uAC00\uC801\uC778 \uC694\uCCAD\uC0AC\uD56D\uC774 \uC788\uB2E4\uBA74 \uC54C\uB824\uC8FC\uC138\uC694!", _jsx("span", { className: "text-gray-400 font-normal ml-1", children: "(\uC120\uD0DD)" })] }), _jsx("textarea", { className: "w-full h-28 p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition", placeholder: "ex.", value: additionalRequests, onChange: (e) => setAdditionalRequests(e.target.value) })] })] }), _jsxs("div", { className: "flex justify-between p-4 bg-gray-50 border-t", children: [_jsx(Button, { onClick: onPrev, buttonName: "\uC774\uC804", type: "secondary" }), _jsx(Button, { onClick: handleNextClick, buttonName: "\uB2E4\uC74C", type: "primary" })] })] }));
};
export default Step4_AdditionalInfo;
