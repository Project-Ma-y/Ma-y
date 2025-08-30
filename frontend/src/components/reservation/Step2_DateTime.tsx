import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Select from "@/components/Select";

interface Step2Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step2_DateTime: React.FC<Step2Props> = ({ formData, onNext, onPrev }) => {
  // 현재 날짜를 기반으로 달력을 렌더링하기 위한 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(formData.selectedDate ? new Date(formData.selectedDate) : null);
  const [startTime, setStartTime] = useState(formData.startTime || "09:00");
  const [endTime, setEndTime] = useState(formData.endTime || "17:00");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간을 0으로 초기화하여 날짜만 비교

  // 주어진 연도와 월의 날짜 수를 반환하는 함수
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 주어진 연도와 월의 첫 번째 날의 요일을 반환하는 함수 (0=일요일, 6=토요일)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const calendarDays = [];
  // 첫 번째 날짜가 시작하기 전의 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  }
  // 월의 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0); // 시간을 0으로 초기화하여 날짜만 비교

    const isToday = dayDate.getTime() === today.getTime();
    const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
    
    // 과거 날짜인지 확인
    const isPast = dayDate.getTime() < today.getTime();

    calendarDays.push(
      <button
        key={day}
        onClick={() => {
          if (!isPast) {
            setSelectedDate(dayDate);
          }
        }}
        className={`
          flex items-center justify-center h-10 w-10 text-lg rounded-full transition-colors
          ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
          ${isToday && !isPast ? "border-2 border-yellow-500" : ""}
          ${isSelected ? "bg-yellow-500 text-white font-bold" : isPast ? "" : "text-gray-800"}
        `}
        disabled={isPast}
        aria-label={`날짜 ${day}`}
      >
        {day}
      </button>
    );
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

  return (
    <div className="p-0">
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-1">언제 동행해드릴까요?</h2>
          <p className="text-sm text-yellow-500">동행 날짜와 시간을 설정해주세요!</p>
        </div>
        
        {/* 달력 영역 */}
        <div className="flex flex-col items-center">
          {/* 달력 헤더 */}
          <div className="flex justify-between items-center w-full mb-4 px-4">
            <button aria-label="이전 달" onClick={handlePrevMonth} disabled={new Date(year, month, 1) <= new Date(today.getFullYear(), today.getMonth(), 1)}>
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-semibold">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
            <button aria-label="다음 달" onClick={handleNextMonth}>
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {/* 요일 */}
          <div className="grid grid-cols-7 text-center w-full">
            {weekDays.map((day, index) => (
              <span key={index} className="text-gray-500 font-medium text-sm">
                {day}
              </span>
            ))}
          </div>
          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-1 text-center w-full mt-2">
            {calendarDays}
          </div>
        </div>

        {/* 시간 선택 드롭다운 */}
        <div className="flex justify-between gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">시작시간</label>
            <Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">종료시간</label>
            <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 bg-gray-50 border-t">
        <Button onClick={onPrev} buttonName="이전" type="secondary" />
        <Button onClick={handleNextClick} buttonName="다음" type="primary" disabled={!selectedDate} />
      </div>
    </div>
  );
};

export default Step2_DateTime;