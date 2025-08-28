import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from "@/components/Input"; // Input 컴포넌트 import (가정)

interface Step3Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step3_Location: React.FC<Step3Props> = ({ formData, onNext, onPrev }) => {
  const [departureAddress, setDepartureAddress] = useState(formData.departureAddress || "한국외국어대학교 서울캠퍼스");
  const [destinationAddress, setDestinationAddress] = useState(formData.destinationAddress || "경희대학교 의료원");
  
  const handleNextClick = () => {
    if (departureAddress && destinationAddress) {
      onNext({ departureAddress, destinationAddress });
    } else {
      console.log("출발지와 목적지를 모두 입력해주세요.");
    }
  };

  return (
    <div className="relative">
      {/* 지도 영역 (임시) */}
      <div className="w-full h-[60vh] bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
        맵 구현중
      </div>

      {/* 오버레이 카드 */}
      <Card className="absolute bottom-0 w-full rounded-b-none p-0">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">어디로 동행해드릴까요?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 font-medium">
            <li>출발지: {departureAddress}</li>
            <li>목적지: {destinationAddress}</li>
          </ul>
        </div>

        <div className="flex justify-center p-4 bg-gray-50 border-t">
          <Button onClick={handleNextClick} buttonName="다음" type="primary" disabled={!departureAddress || !destinationAddress} />
        </div>
      </Card>
    </div>
  );
};

export default Step3_Location;
