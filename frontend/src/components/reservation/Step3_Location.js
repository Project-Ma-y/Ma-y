import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
const Step3_Location = ({ formData, onNext, onPrev }) => {
    const [departureAddress, setDepartureAddress] = useState(formData.departureAddress || "한국외국어대학교 서울캠퍼스");
    const [destinationAddress, setDestinationAddress] = useState(formData.destinationAddress || "경희대학교 의료원");
    const handleNextClick = () => {
        if (departureAddress && destinationAddress) {
            onNext({ departureAddress, destinationAddress });
        }
        else {
            console.log("출발지와 목적지를 모두 입력해주세요.");
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-full h-[60vh] bg-gray-200 flex items-center justify-center text-gray-500 font-semibold", children: "\uB9F5 \uAD6C\uD604\uC911" }), _jsxs(Card, { className: "absolute bottom-0 w-full rounded-b-none p-0", children: [_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uC5B4\uB514\uB85C \uB3D9\uD589\uD574\uB4DC\uB9B4\uAE4C\uC694?" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-gray-700 font-medium", children: [_jsxs("li", { children: ["\uCD9C\uBC1C\uC9C0: ", departureAddress] }), _jsxs("li", { children: ["\uBAA9\uC801\uC9C0: ", destinationAddress] })] })] }), _jsx("div", { className: "flex justify-center p-4 bg-gray-50 border-t", children: _jsx(Button, { onClick: handleNextClick, buttonName: "\uB2E4\uC74C", type: "primary", disabled: !departureAddress || !destinationAddress }) })] })] }));
};
export default Step3_Location;
