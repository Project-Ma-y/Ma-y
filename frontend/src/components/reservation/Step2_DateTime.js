import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Button from "@/components/button/Button";
import Select from "@/components/Select";
const Step2_DateTime = ({ formData, onNext, onPrev }) => {
    // 현재 날짜를 기반으로 달력을 렌더링하기 위한 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(formData.selectedDate ? new Date(formData.selectedDate) : null);
    const [startTime, setStartTime] = useState(formData.startTime || "09:00");
    const [endTime, setEndTime] = useState(formData.endTime || "17:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 0으로 초기화하여 날짜만 비교
    // 주어진 연도와 월의 날짜 수를 반환하는 함수
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    // 주어진 연도와 월의 첫 번째 날의 요일을 반환하는 함수 (0=일요일, 6=토요일)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = [];
    // 첫 번째 날짜가 시작하기 전의 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(_jsx("div", { className: "w-10 h-10" }, `empty-${i}`));
    }
    // 월의 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        dayDate.setHours(0, 0, 0, 0); // 시간을 0으로 초기화하여 날짜만 비교
        const isToday = dayDate.getTime() === today.getTime();
        const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
        // 과거 날짜인지 확인
        const isPast = dayDate.getTime() < today.getTime();
        calendarDays.push(_jsx("button", { onClick: () => {
                if (!isPast) {
                    setSelectedDate(dayDate);
                }
            }, className: `
          flex items-center justify-center h-10 w-10 text-lg rounded-full transition-colors
          ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
          ${isToday && !isPast ? "border-2 border-yellow-500" : ""}
          ${isSelected ? "bg-yellow-500 text-white font-bold" : isPast ? "" : "text-gray-800"}
        `, disabled: isPast, "aria-label": `날짜 ${day}`, children: day }, day));
    }
    // 이전 달로 이동
    const handlePrevMonth = () => {
        // 현재 월 이전으로는 이동 불가능하게 막기
        if (new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1)) {
            setCurrentDate(new Date(year, month - 1, 1));
        }
    };
    // 다음 달로 이동
    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    // 시간 옵션 생성 (00:00 ~ 23:30, 30분 단위)
    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                options.push(`${hour}:${minute}`);
            }
        }
        return options;
    };
    const timeOptions = generateTimeOptions();
    const handleNextClick = () => {
        if (!selectedDate) {
            console.log("날짜를 선택해주세요.");
            return;
        }
        onNext({ selectedDate: selectedDate.toISOString(), startTime, endTime });
    };
    return (_jsxs("div", { className: "p-0", children: [_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "\uC5B8\uC81C \uB3D9\uD589\uD574\uB4DC\uB9B4\uAE4C\uC694?" }), _jsx("p", { className: "text-sm text-yellow-500", children: "\uB3D9\uD589 \uB0A0\uC9DC\uC640 \uC2DC\uAC04\uC744 \uC124\uC815\uD574\uC8FC\uC138\uC694!" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "flex justify-between items-center w-full mb-4 px-4", children: [_jsx("button", { "aria-label": "\uC774\uC804 \uB2EC", onClick: handlePrevMonth, disabled: new Date(year, month, 1) <= new Date(today.getFullYear(), today.getMonth(), 1), children: _jsx("svg", { className: "h-6 w-6 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsxs("span", { className: "text-lg font-semibold", children: [currentDate.getFullYear(), "\uB144 ", currentDate.getMonth() + 1, "\uC6D4"] }), _jsx("button", { "aria-label": "\uB2E4\uC74C \uB2EC", onClick: handleNextMonth, children: _jsx("svg", { className: "h-6 w-6 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] }), _jsx("div", { className: "grid grid-cols-7 text-center w-full", children: weekDays.map((day, index) => (_jsx("span", { className: "text-gray-500 font-medium text-sm", children: day }, index))) }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center w-full mt-2", children: calendarDays })] }), _jsxs("div", { className: "flex justify-between gap-4 mt-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\uC2DC\uC791\uC2DC\uAC04" }), _jsx(Select, { value: startTime, onChange: (e) => setStartTime(e.target.value), children: timeOptions.map(time => (_jsx("option", { value: time, children: time }, time))) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\uC885\uB8CC\uC2DC\uAC04" }), _jsx(Select, { value: endTime, onChange: (e) => setEndTime(e.target.value), children: timeOptions.map(time => (_jsx("option", { value: time, children: time }, time))) })] })] })] }), _jsxs("div", { className: "flex justify-between p-4 bg-gray-50 border-t", children: [_jsx(Button, { onClick: onPrev, buttonName: "\uC774\uC804", type: "secondary" }), _jsx(Button, { onClick: handleNextClick, buttonName: "\uB2E4\uC74C", type: "primary", disabled: !selectedDate })] })] }));
};
export default Step2_DateTime;
