import React from 'react';
import Button from '@/components/button/Button';
import Header from '@/components/header/header';

const ComponentList = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📦 Component List</h2>
      <div className="border p-4">
        <h3 className="font-semibold mb-2">Button</h3>
        <div className="flex flex-col gap-4 p-6 bg-[var(--color-background-default)] min-h-screen">
      {/* ✅ 기본 버튼 */}
      <Button
        type="default"
        buttonName="기본 버튼"
        onClick={() => alert("기본 버튼 클릭")}
      />

      {/* ✅ primary 버튼 */}
      <Button
        type="primary"
        buttonName="확인"
        onClick={() => alert("확인 클릭")}
      />

      {/* ✅ secondary 버튼 */}
      <Button
        type="secondary"
        buttonName="취소"
        onClick={() => alert("취소 클릭")}
      />

      {/* ✅ 닫기 버튼 */}
      <Button
        type="close"
        onClick={() => alert("닫기 클릭")}
      />

      {/* ✅ 커스텀 색상 버튼 */}
      <Button
        buttonName="커스텀 색상"
        bgColor="var(--color-blue)"
        textColor="var(--color-white)"
        onClick={() => alert("커스텀 클릭")}
      />

      {/* ✅ 비활성화된 버튼 */}
      <Button
        type="primary"
        buttonName="비활성 버튼"
        disabled
      />
    </div>


        <h3 className="font-semibold mb-2">header</h3>
        <Header />
        <Header type="header-a" title="텍스트"/>
        <Header type="header-b" title="텍스트 예시"/>
      </div>
    </div>
  );
};

export default ComponentList;
