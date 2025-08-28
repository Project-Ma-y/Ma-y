import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Radio from "@/components/Radio";
import Checkbox from "@/components/Checkbox";

interface Step4Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

const Step4_AdditionalInfo: React.FC<Step4Props> = ({ formData, onNext, onPrev }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(formData.roundTrip || false);
  const [assistanceTypes, setAssistanceTypes] = useState(formData.assistanceTypes || []);
  const [additionalRequests, setAdditionalRequests] = useState(formData.additionalRequests || "");

  const handleAssistanceTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setAssistanceTypes([...assistanceTypes, type]);
    } else {
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

  return (
    <div className="p-0">
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold mb-4">몇 가지만 더 여쭤볼게요!</h2>
        
        {/* 왕복 여부 */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">함께 돌아오길 원하시나요?</h3>
          <div className="space-y-2">
            <Radio 
              name="roundTrip" 
              checked={!isRoundTrip} 
              onChange={() => setIsRoundTrip(false)}
            >
              아니오! 갈 때만 동행이 필요해요 (편도)
            </Radio>
            <Radio 
              name="roundTrip" 
              checked={isRoundTrip} 
              onChange={() => setIsRoundTrip(true)}
            >
              네! 돌아올 때도 함께해주세요. (왕복)
            </Radio>
          </div>
        </div>
        
        {/* 도움 유형 */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">어떤 도움이 필요하신가요?</h3>
          <div className="space-y-2">
            <Checkbox 
              checked={assistanceTypes.includes("guide")} 
              onChange={(checked) => handleAssistanceTypeChange("guide", checked)}
            >
              길안내 및 이동 보조
            </Checkbox>
            <Checkbox 
              checked={assistanceTypes.includes("admin")} 
              onChange={(checked) => handleAssistanceTypeChange("admin", checked)}
            >
              접수 및 행정 보조 (은행, 관공서 등)
            </Checkbox>
            <Checkbox 
              checked={assistanceTypes.includes("shopping")} 
              onChange={(checked) => handleAssistanceTypeChange("shopping", checked)}
            >
              장보기 보조 (마트, 시장 가실 때)
            </Checkbox>
            <Checkbox 
              checked={assistanceTypes.includes("other")} 
              onChange={(checked) => handleAssistanceTypeChange("other", checked)}
            >
              기타
            </Checkbox>
          </div>
        </div>

        {/* 추가 요청사항 */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            추가적인 요청사항이 있다면 알려주세요! 
            <span className="text-gray-400 font-normal ml-1">(선택)</span>
          </h3>
          <textarea
            className="w-full h-28 p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
            placeholder="ex."
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between p-4 bg-gray-50 border-t">
        <Button onClick={onPrev} buttonName="이전" type="secondary" />
        <Button onClick={handleNextClick} buttonName="다음" type="primary" />
      </div>
    </div>
  );
};

export default Step4_AdditionalInfo;
