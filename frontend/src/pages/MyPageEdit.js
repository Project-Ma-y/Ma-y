import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/MyPageEdit.tsx
import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useUserStore } from "@/store/userStore";
import { updateMyProfile } from "@/services/userApi";
const digitsOnly = (v) => v.replace(/\D/g, "");
export default function MyPageEdit() {
    const navigate = useNavigate();
    const ui = useUIStore();
    const { profile, isProfileLoading, fetchUserProfile } = useUserStore();
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    // 화면 입력 상태
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        birthdate: "",
        address: "",
    });
    // 초기값 주입
    useEffect(() => {
        if (!profile)
            return;
        setForm({
            name: profile.name ?? "",
            phone: profile.phone ?? "",
            email: profile.email ?? "",
            gender: profile.gender ?? "",
            birthdate: profile.birthdate ?? "",
            address: profile.address ?? "",
        });
    }, [profile]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "phone" ? digitsOnly(value) : value,
        }));
    };
    const onChangeGender = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, gender: value }));
    };
    // profile과 비교해서 변경된 값만 전송
    const patch = useMemo(() => {
        if (!profile)
            return {};
        const p = {};
        if (form.name.trim() !== (profile.name ?? ""))
            p.name = form.name.trim();
        if (digitsOnly(form.phone) !== digitsOnly(profile.phone ?? ""))
            p.phone = digitsOnly(form.phone);
        if ((form.gender || undefined) !== profile.gender) {
            if (form.gender)
                p.gender = form.gender;
        }
        if ((form.birthdate || "") !== (profile.birthdate ?? ""))
            p.birthdate = form.birthdate || undefined;
        if (form.address.trim() !== (profile.address ?? ""))
            p.address = form.address.trim();
        // 빈 문자열 필드 제거 (서버 스펙: 빈 문자열 금지, 미전송 가능)
        Object.keys(p).forEach((k) => {
            const key = k;
            if (typeof p[key] === "string" && p[key].trim() === "") {
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
        }
        catch (e) {
            const raw = e?.response?.data?.message || e?.message || "서버 오류가 발생했습니다.";
            setErrorMsg(String(raw));
            ui.openModal("fail-modal");
        }
        finally {
            setSaving(false);
        }
    };
    if (isProfileLoading && !profile) {
        return (_jsx(MainLayout, { headerProps: { title: "내 정보 수정", showBack: true }, showNav: true, children: _jsx("div", { className: "p-6 text-center text-gray-500", children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }) }));
    }
    return (_jsxs(MainLayout, { headerProps: { title: "내 정보 수정", showBack: true }, showNav: true, children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("span", { className: "flex h-24 w-24 items-center justify-center rounded-full bg-gray-200", children: _jsx("svg", { className: "h-16 w-16 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsx("button", { className: "absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow", "aria-label": "\uC0AC\uC9C4 \uC218\uC815\uD558\uAE30", children: _jsx("svg", { className: "h-4 w-4 text-gray-700", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" }) }) })] }), _jsx("button", { className: "mt-2 text-sm text-[var(--color-primary)] font-semibold", children: "\uC0AC\uC9C4 \uC218\uC815\uD558\uAE30" })] }), _jsxs(Card, { className: "space-y-4", children: [_jsx(Input, { label: "\uC774\uB984", name: "name", value: form.name, onChange: onChange }), _jsx(Input, { label: "\uC774\uBA54\uC77C", name: "email", value: form.email, onChange: () => { }, readOnly: true }), _jsx(Input, { label: "\uC804\uD654\uBC88\uD638", name: "phone", value: form.phone, onChange: onChange, placeholder: "01012345678" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600 mb-1", children: "\uC131\uBCC4" }), _jsxs("select", { className: "w-full border rounded-md px-3 py-2 text-sm", value: form.gender, onChange: onChangeGender, children: [_jsx("option", { value: "", children: "\uC120\uD0DD \uC548 \uD568" }), _jsx("option", { value: "male", children: "\uB0A8\uC131" }), _jsx("option", { value: "female", children: "\uC5EC\uC131" })] })] }), _jsx(Input, { label: "\uC0DD\uB144\uC6D4\uC77C (YYYY-MM-DD)", name: "birthdate", value: form.birthdate, onChange: onChange, placeholder: "1970-05-15" }), _jsx(Input, { label: "\uC8FC\uC18C", name: "address", value: form.address, onChange: onChange, placeholder: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 123" })] }), _jsx("div", { className: "pb-4", children: _jsx(Button, { type: "primary", buttonName: saving ? "저장 중..." : hasChanges ? "저장하기" : "변경 사항 없음", className: "w-full h-12", onClick: handleSaveChanges, disabled: saving || !hasChanges }) })] }), _jsx(Modal, { id: "success-modal", variant: "success", title: "\uBCC0\uACBD \uB0B4\uC6A9\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", subtext: " ", confirmText: "\uD655\uC778", onConfirm: () => navigate(-1), showCancel: false }), _jsx(Modal, { id: "fail-modal", variant: "warning", title: "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4", subtext: errorMsg || "네트워크/인증 상태를 확인한 뒤 다시 시도해주세요.", confirmText: "\uD655\uC778", showCancel: false })] }));
}
