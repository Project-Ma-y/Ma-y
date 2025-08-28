// src/pages/MyPageEdit.tsx
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import clsx from "clsx";
import Modal from "@/components/Modal";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore"; // useUIStore import

interface Guardian {
  name: string;
  relation: string;
  phone: string;
}

export default function MyPageEdit() {
  const navigate = useNavigate();
  const uiStore = useUIStore(); // Get the UI store instance

  // Dummy data, should be fetched from API or state management
  const [profile, setProfile] = useState({
    name: "김이박",
    phone: "010-1111-2222",
    email: "qwer@naver.com",
  });

  const [guardians, setGuardians] = useState<Guardian[]>([
    { name: "성 이름", relation: "관계", phone: "전화번호" },
    { name: "성 이름", relation: "관계", phone: "전화번호" },
  ]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardianChange = (index: number, field: keyof Guardian, value: string) => {
    const newGuardians = [...guardians];
    newGuardians[index] = { ...newGuardians[index], [field]: value };
    setGuardians(newGuardians);
  };

  const handleSaveChanges = () => {
    // Logic to save the updated information to the server.
    console.log("Changes saved:", { profile, guardians });
    uiStore.openModal("success-modal"); // Open the modal using the store
  };

  const handleModalConfirm = () => {
    navigate(-1); // Navigate back to the previous screen
  };

  return (
    <MainLayout
      headerProps={{
        title: "내 정보 수정",
        showBack: true,
      }}
      showNav={true}
    >
      <div className="space-y-6">
        {/* Profile image edit section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <svg className="h-16 w-16 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
              </svg>
            </span>
            <button
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow"
              aria-label="사진 수정하기"
            >
              <svg className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
              </svg>
            </button>
          </div>
          <button className="mt-2 text-sm text-[var(--color-primary)] font-semibold">
            사진 수정하기
          </button>
        </div>

        {/* Input fields for profile information */}
        <Card className="space-y-4">
          <Input
            label="이름"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="**********"
            readOnly
          />
          <Input
            label="이메일"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            readOnly
          />
          <Input
            label="전화번호"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
          />
        </Card>

        {/* Guardian section */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700">
            보호 대상자 ({guardians.length}명)
          </div>
          {guardians.map((guardian, index) => (
            <Card key={index} className="flex flex-col space-y-3 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-bold">{guardian.name}</span>
                    <span className="rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">m:y</span>
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {guardian.relation} | {guardian.phone}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  label="이름"
                  value={guardian.name}
                  onChange={(e) => handleGuardianChange(index, "name", e.target.value)}
                />
                <Input
                  label="관계"
                  value={guardian.relation}
                  onChange={(e) => handleGuardianChange(index, "relation", e.target.value)}
                />
                <Input
                  label="전화번호"
                  value={guardian.phone}
                  onChange={(e) => handleGuardianChange(index, "phone", e.target.value)}
                />
              </div>
            </Card>
          ))}
        </div>
        
        {/* Save button */}
        <div className="pb-4">
          <Button
            type="primary"
            buttonName="저장하기"
            className="w-full h-12"
            onClick={handleSaveChanges}
          />
        </div>
      </div>

      {/* Success modal */}
      <Modal
        id="success-modal"
        variant="success"
        title="변경 내용이 저장되었습니다."
        subtext=" "
        confirmText="확인"
        onConfirm={handleModalConfirm}
        showCancel={false}
      />
    </MainLayout>
  );
}
