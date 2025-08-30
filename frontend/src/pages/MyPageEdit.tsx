// src/pages/MyPageEdit.tsx
import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from '@/components/Input'
import Modal from "@/components/Modal";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useUserStore } from "@/store/userStore";
import { updateMyProfile } from "@/services/userApi";
import type { ProfileUpdatePayload } from "@/services/userApi";

type Gender = "male" | "female" | "";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export default function MyPageEdit() {
  const navigate = useNavigate();
  const ui = useUIStore();
  const { profile, isProfileLoading, fetchUserProfile } = useUserStore();

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // 화면 입력 상태
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    email: string;     // 읽기 전용
    gender: Gender;
    birthdate: string; // YYYY-MM-DD
    address: string;
  }>({
    name: "",
    phone: "",
    email: "",
    gender: "",
    birthdate: "",
    address: "",
  });

  // 초기값 주입
  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      email: profile.email ?? "",
      gender: (profile.gender as Gender) ?? "",
      birthdate: profile.birthdate ?? "",
      address: profile.address ?? "",
    });
  }, [profile]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? digitsOnly(value) : value,
    }));
  };

  const onChangeGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Gender;
    setForm((prev) => ({ ...prev, gender: value }));
  };

  // profile과 비교해서 변경된 값만 전송
  const patch: ProfileUpdatePayload = useMemo(() => {
    if (!profile) return {};
    const p: ProfileUpdatePayload = {};

    if (form.name.trim() !== (profile.name ?? "")) p.name = form.name.trim();
    if (digitsOnly(form.phone) !== digitsOnly(profile.phone ?? "")) p.phone = digitsOnly(form.phone);
    if ((form.gender || undefined) !== (profile.gender as Gender | undefined)) {
      if (form.gender) p.gender = form.gender as "male" | "female";
    }
    if ((form.birthdate || "") !== (profile.birthdate ?? "")) p.birthdate = form.birthdate || undefined;
    if (form.address.trim() !== (profile.address ?? "")) p.address = form.address.trim();

    // 빈 문자열 필드 제거 (서버 스펙: 빈 문자열 금지, 미전송 가능)
    Object.keys(p).forEach((k) => {
      const key = k as keyof ProfileUpdatePayload;
      if (typeof p[key] === "string" && (p[key] as string).trim() === "") {
        delete p[key];
      }
    });

    return p;
  }, [form, profile]);

  const hasChanges = useMemo(() => Object.keys(patch).length > 0, [patch]);

  const handleSaveChanges = async () => {
    setErrorMsg("");

    if (!hasChanges) {
      ui.openModal("success-modal"); // 변경 없음 → 그냥 성공 UX
      return;
    }
    // 개별 제약: name/address를 보낼 때는 빈 문자열 금지 (이미 필터링했지만 더블 체크)
    if ("name" in patch && !patch.name) {
      setErrorMsg("이름은 빈 값일 수 없습니다.");
      ui.openModal("fail-modal");
      return;
    }
    if ("address" in patch && !patch.address) {
      setErrorMsg("주소는 빈 값일 수 없습니다.");
      ui.openModal("fail-modal");
      return;
    }
    // birthdate 형식 가벼운 체크
    if (patch.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(patch.birthdate)) {
      setErrorMsg("생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)");
      ui.openModal("fail-modal");
      return;
    }

    try {
      setSaving(true);
      await updateMyProfile(patch);
      await fetchUserProfile(); // 최신 정보 동기화
      ui.openModal("success-modal");
    } catch (e: any) {
      const raw = e?.response?.data?.message || e?.message || "서버 오류가 발생했습니다.";
      setErrorMsg(String(raw));
      ui.openModal("fail-modal");
    } finally {
      setSaving(false);
    }
  };

  if (isProfileLoading && !profile) {
    return (
      <MainLayout headerProps={{ title: "내 정보 수정", showBack: true }} showNav={true}>
        <div className="p-6 text-center text-gray-500">불러오는 중…</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      headerProps={{ title: "내 정보 수정", showBack: true }}
      showNav={true}
    >
      <div className="space-y-6">
        {/* Profile image edit section (UI만, 업로드 연동시 별도 API) */}
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

        {/* Profile form */}
        <Card className="space-y-4">
          <Input
            label="이름"
            name="name"
            value={form.name}
            onChange={onChange}
          />
          <Input
            label="이메일"
            name="email"
            value={form.email}
            onChange={() => {}}
            readOnly
          />
          <Input
            label="전화번호"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="01012345678"
          />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">성별</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.gender}
              onChange={onChangeGender}
            >
              <option value="">선택 안 함</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <Input
            label="생년월일 (YYYY-MM-DD)"
            name="birthdate"
            value={form.birthdate}
            onChange={onChange}
            placeholder="1970-05-15"
          />
          <Input
            label="주소"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="서울특별시 강남구 테헤란로 123"
          />
        </Card>

        {/* Save */}
        <div className="pb-4">
          <Button
            type="primary"
            buttonName={saving ? "저장 중..." : hasChanges ? "저장하기" : "변경 사항 없음"}
            className="w-full h-12"
            onClick={handleSaveChanges}
            disabled={saving || !hasChanges}
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
        onConfirm={() => navigate(-1)}
        showCancel={false}
      />

      {/* Fail modal */}
      <Modal
        id="fail-modal"
        variant="warning"
        title="저장에 실패했습니다"
        subtext={errorMsg || "네트워크/인증 상태를 확인한 뒤 다시 시도해주세요."}
        confirmText="확인"
        showCancel={false}
      />
    </MainLayout>
  );
}
