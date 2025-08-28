import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import TagList from "@/components/TagList";
import Modal from "@/components/Modal";
import { register, type RegisterPayload } from "@/services/authApi";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

// 가족 사용자를 위한 특성 선택지
const TRAITS = [
  "다정해요", "활발해요", "꼼꼼해요", "잘 웃어요", "차분해요", "조용해요", "유쾌해요",
  "이야기를 잘 들어줘요", "책임감이 강해요", "배려심이 깊어요", "사교성이 좋아요", "똑부러져요",
];

// 회원가입 페이지 컴포넌트
export default function SignUp() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 회원가입 단계를 관리
  const [traits, setTraits] = useState<string[]>([]); // 선호하는 특성 목록
  const [successOpen, setSuccessOpen] = useState(false); // 가입 성공 모달 상태
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태
  const [err, setErr] = useState<string>(""); // 오류 메시지 상태

  // 모든 폼 필드 상태 관리
  const [form, setForm] = useState({
    customerType: "family" as RegisterPayload["customerType"],
    id: "",
    name: "",
    gender: "",
    phone: "",
    address: "",
    birthdate: "",
    password: "",
    pwVerify: "",
  });

  // 특성 선택 개수를 5개로 제한하는 함수
  const max5 = (next: string[]) => next.slice(0, 5);

  // 모든 폼 필드의 유효성 검사
  const validate = () => {
    if (!form.name.trim()) return "이름을 입력하세요.";
    if (!form.gender) return "성별을 선택하세요.";
    if (!form.id.trim()) return "아이디를 입력하세요.";
    if (!form.phone.trim()) return "전화번호를 입력하세요.";
    if (!form.address.trim()) return "주소를 입력하세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthdate)) return "생년월일은 YYYY-MM-DD 형식입니다.";
    // 비밀번호 규칙: 소문자, 숫자, 특수문자 포함 8-20자
    const pwRule = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;
    if (!pwRule.test(form.password)) return "비밀번호는 소문자/숫자/특수문자 포함 8~20자입니다.";
    if (form.password !== form.pwVerify) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  // 폼 제출 핸들러
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr("");
    setLoading(true);
    try {
      // API payload 구성
      const payload: RegisterPayload = {
        customerType: form.customerType,
        id: form.id,
        password: form.password,
        pwVerify: form.pwVerify,
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        address: form.address,
        birthdate: form.birthdate,
      };

      await register(payload);
      setSuccessOpen(true);
    } catch (e: any) {
      // 서버 응답에 따른 오류 메시지 처리
      setErr(
        e?.response?.data?.message ??
        (e?.response?.status === 409 ? "이미 등록된 아이디입니다." : "요청 중 오류가 발생했습니다.")
      );
    } finally {
      setLoading(false);
    }
  };

  // '다음' 버튼 클릭 시 다음 단계로 이동
  const handleNext = () => {
    setStep(2);
  };

  return (
    <MainLayout headerProps={{ title: "회원가입", showBack: true }} contentBg="bg-white">
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold">어떤 동행인을 원하나요?</div>
            <div className="mt-1 text-[var(--color-primary)] font-semibold">최대 5개 선택가능</div>
          </div>
          <div>
            <div className="mb-2 text-sm">🍀 선호하는 <b>푸름이의 성격</b>을 선택해주세요!</div>
            <TagList
              tags={TRAITS}
              value={traits}
              onChange={(next) => setTraits(max5(next))}
              multiple
            />
          </div>
          <div className="pt-4">
            <Button
              type="primary"
              className="w-full h-14 rounded-2xl text-lg"
              buttonName="다음"
              onClick={handleNext}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-3">
          <Input
            label="이름"
            required
            value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
          />
          <div className="space-y-2">
            <span className="block text-sm text-gray-400">
              성별<span className="pl-1 text-red-500">*</span>
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                className={clsx(
                  "flex-1 h-12 rounded-2xl border transition-colors",
                  form.gender === "male"
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                )}
                onClick={() => setForm(s => ({ ...s, gender: "male" }))}
              >
                남성
              </button>
              <button
                type="button"
                className={clsx(
                  "flex-1 h-12 rounded-2xl border transition-colors",
                  form.gender === "female"
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                )}
                onClick={() => setForm(s => ({ ...s, gender: "female" }))}
              >
                여성
              </button>
            </div>
          </div>
          <Input
            label="아이디"
            required
            value={form.id}
            onChange={e => setForm(s => ({ ...s, id: e.target.value }))}
          />
          <Input
            label="전화번호"
            required
            placeholder="010-0000-0000"
            id="phone"
            value={form.phone}
            onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
          />
          <Input
            label="비밀번호"
            required
            type="password"
            value={form.password}
            onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
          />
          <Input
            label="비밀번호 확인"
            required
            type="password"
            value={form.pwVerify}
            onChange={e => setForm(s => ({ ...s, pwVerify: e.target.value }))}
          />
          <Input
            label="도로명 주소"
            required
            value={form.address}
            onChange={e => setForm(s => ({ ...s, address: e.target.value }))}
          />
          <Input
            label="생년월일"
            required
            placeholder="YYYY-MM-DD"
            id="birthdate"
            value={form.birthdate}
            onChange={e => setForm(s => ({ ...s, birthdate: e.target.value }))}
          />
          {err && <div className="pt-1 text-sm text-red-500">{err}</div>}
          <div className="pt-2">
            <Button
              type="primary"
              className="w-full h-14 rounded-2xl text-lg"
              buttonName={loading ? "회원가입 중..." : "회원가입"}
            />
          </div>
          <div className="pb-[16px]" />
        </form>
      )}

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-[90%] max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293A1 1 0 1 0 3.293 10.707l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-lg font-extrabold">가입이 완료되었습니다.</div>
            <div className="mt-1 text-sm text-gray-500">이제부터 외출에는 메이가 함께할게요.</div>
            <div className="mt-5 grid gap-3">
              <Button
                type="primary"
                className="h-12 rounded-2xl"
                buttonName="홈 화면으로"
                onClick={() => nav("/")}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
