import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import TagList from "@/components/TagList";
import { register } from "@/services/authApi";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
const TRAITS = [
    "다정해요", "활발해요", "꼼꼼해요", "잘 웃어요", "차분해요", "조용해요", "유쾌해요",
    "이야기를 잘 들어줘요", "책임감이 강해요", "배려심이 깊어요", "사교성이 좋아요", "똑부러져요",
];
export default function SignUp() {
    const nav = useNavigate();
    const [step, setStep] = useState(1);
    // ✅ 보호자|시니어 선택(필수)
    const [customerType, setCustomerType] = useState(null);
    const [traits, setTraits] = useState([]);
    const [successOpen, setSuccessOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [form, setForm] = useState({
        id: "",
        name: "",
        gender: "",
        phone: "",
        address: "",
        birthdate: "",
        password: "",
        pwVerify: "",
    });
    const max5 = (next) => next.slice(0, 5);
    const validate = () => {
        if (!customerType)
            return "회원 유형(보호자/시니어)을 선택하세요.";
        if (!form.name.trim())
            return "이름을 입력하세요.";
        if (!form.gender)
            return "성별을 선택하세요.";
        if (!form.id.trim())
            return "아이디를 입력하세요.";
        if (!form.phone.trim())
            return "전화번호를 입력하세요.";
        if (!form.address.trim())
            return "주소를 입력하세요.";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthdate))
            return "생년월일은 YYYY-MM-DD 형식입니다.";
        const pwRule = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;
        if (!pwRule.test(form.password))
            return "비밀번호는 소문자/숫자/특수문자 포함 8~20자입니다.";
        if (form.password !== form.pwVerify)
            return "비밀번호가 일치하지 않습니다.";
        return "";
    };
    const submit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setErr(v);
            return;
        }
        setErr("");
        setLoading(true);
        try {
            const payload = {
                customerType: customerType, // ✅ 필수
                id: form.id, // ✅ @may.com 은 백엔드에서 붙음
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
        }
        catch (e) {
            setErr(e?.response?.data?.message ??
                (e?.response?.status === 408
                    ? "이미 존재하는 사용자 ID입니다."
                    : e?.response?.status === 409
                        ? "이미 등록된 이메일입니다."
                        : "요청 중 오류가 발생했습니다."));
        }
        finally {
            setLoading(false);
        }
    };
    const handleNext = () => setStep(2);
    return (_jsxs(MainLayout, { headerProps: { title: "회원가입", showBack: true }, contentBg: "bg-white", children: [step === 1 && (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-extrabold", children: "\uC5B4\uB5A4 \uB3D9\uD589\uC778\uC744 \uC6D0\uD558\uB098\uC694?" }), _jsx("div", { className: "mt-1 text-[var(--color-primary)] font-semibold", children: "\uCD5C\uB300 5\uAC1C \uC120\uD0DD\uAC00\uB2A5" })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-2 text-sm", children: ["\uD83C\uDF40 \uC120\uD638\uD558\uB294 ", _jsx("b", { children: "\uD478\uB984\uC774\uC758 \uC131\uACA9" }), "\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694!"] }), _jsx(TagList, { tags: TRAITS, value: traits, onChange: (next) => setTraits(max5(next)), multiple: true })] }), _jsx("div", { className: "pt-4", children: _jsx(Button, { type: "primary", className: "w-full h-14 rounded-2xl text-lg", buttonName: "\uB2E4\uC74C", onClick: handleNext }) })] })), step === 2 && (_jsxs("form", { onSubmit: submit, className: "mx-auto w-full max-w-sm space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["\uD68C\uC6D0 \uC720\uD615", _jsx("span", { className: "pl-1 text-red-500", children: "*" })] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                    { key: "family", label: "보호자" },
                                    { key: "senior", label: "시니어" },
                                ].map(({ key, label }) => (_jsx("button", { type: "button", className: clsx("h-12 rounded-2xl border transition-colors", customerType === key
                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"), onClick: () => setCustomerType(key), children: label }, key))) })] }), _jsx(Input, { label: "\uC774\uB984", required: true, value: form.name, onChange: e => setForm(s => ({ ...s, name: e.target.value })) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("span", { className: "block text-sm text-gray-400", children: ["\uC131\uBCC4", _jsx("span", { className: "pl-1 text-red-500", children: "*" })] }), _jsx("div", { className: "flex space-x-2", children: ["male", "female"].map(g => (_jsx("button", { type: "button", className: clsx("flex-1 h-12 rounded-2xl border transition-colors", form.gender === g
                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"), onClick: () => setForm(s => ({ ...s, gender: g })), children: g === "male" ? "남성" : "여성" }, g))) })] }), _jsx(Input, { label: "\uC544\uC774\uB514", required: true, value: form.id, onChange: e => setForm(s => ({ ...s, id: e.target.value })) }), _jsx(Input, { label: "\uC804\uD654\uBC88\uD638", required: true, placeholder: "010-0000-0000", id: "phone", value: form.phone, onChange: e => setForm(s => ({ ...s, phone: e.target.value })) }), _jsx(Input, { label: "\uBE44\uBC00\uBC88\uD638", required: true, type: "password", value: form.password, onChange: e => setForm(s => ({ ...s, password: e.target.value })) }), _jsx(Input, { label: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", required: true, type: "password", value: form.pwVerify, onChange: e => setForm(s => ({ ...s, pwVerify: e.target.value })) }), _jsx(Input, { label: "\uB3C4\uB85C\uBA85 \uC8FC\uC18C", required: true, value: form.address, onChange: e => setForm(s => ({ ...s, address: e.target.value })) }), _jsx(Input, { label: "\uC0DD\uB144\uC6D4\uC77C", required: true, placeholder: "YYYY-MM-DD", id: "birthdate", value: form.birthdate, onChange: e => setForm(s => ({ ...s, birthdate: e.target.value })) }), err && _jsx("div", { className: "pt-1 text-sm text-red-500", children: err }), _jsx("div", { className: "pt-2", children: _jsx(Button, { type: "primary", className: "w-full h-14 rounded-2xl text-lg", buttonName: loading ? "회원가입 중..." : "회원가입" }) }), _jsx("div", { className: "pb-[16px]" })] })), successOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40" }), _jsxs("div", { className: "relative z-10 w-[90%] max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl", children: [_jsx("div", { className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500", children: _jsx("svg", { className: "h-6 w-6 text-white", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293A1 1 0 1 0 3.293 10.707l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "text-lg font-extrabold", children: "\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), _jsx("div", { className: "mt-1 text-sm text-gray-500", children: "\uC774\uC81C\uBD80\uD130 \uC678\uCD9C\uC5D0\uB294 \uBA54\uC774\uAC00 \uD568\uAED8\uD560\uAC8C\uC694." }), _jsx("div", { className: "mt-5 grid gap-3", children: _jsx(Button, { type: "primary", className: "h-12 rounded-2xl", buttonName: "\uD648 \uD654\uBA74\uC73C\uB85C", onClick: () => nav("/") }) })] })] }))] }));
}
