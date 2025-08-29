import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/ParentsManage.tsx
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { createFamily, deleteFamily, updateFamily } from "@/services/familyApi";
const digitsOnly = (v) => v.replace(/\D/g, "");
const isYYYYMMDD = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const pickMid = (p) => p?.memberId ?? p?.member_id ?? p?.mid ?? p?.id ?? p?._id ?? undefined;
export default function ParentsManage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { profile, fetchUserProfile } = useUserStore();
    const [forms, setForms] = useState([]);
    const [rowErrors, setRowErrors] = useState({});
    const [rowStatus, setRowStatus] = useState({});
    const [rowMsg, setRowMsg] = useState({});
    const [savingAll, setSavingAll] = useState(false);
    useEffect(() => {
        if (state?.parents?.length) {
            setForms(state.parents.map((p) => ({
                mid: p.mid,
                name: p.name ?? "",
                phone: digitsOnly(p.phone ?? ""),
                gender: p.gender ?? "",
                birthdate: p.birthdate ?? "",
                relation: p.relation ?? "",
            })));
            return;
        }
        const base = (profile?.registeredFamily ?? []).map((p) => ({
            mid: pickMid(p),
            name: p.name ?? "",
            phone: digitsOnly(p.phone ?? ""),
            gender: p.gender ?? "",
            birthdate: p.birthdate ?? "",
            relation: p.relation ?? "",
        })) ?? [];
        setForms(base.length ? base : [{ mid: undefined, name: "", phone: "", gender: "", birthdate: "", relation: "" }]);
    }, [profile, state?.parents]);
    const addRow = () => setForms((prev) => [...prev, { mid: undefined, name: "", phone: "", gender: "", birthdate: "", relation: "" }]);
    const removeRowLocal = (idx) => {
        setForms((prev) => prev.filter((_, i) => i !== idx));
        setRowErrors(({ [idx]: _a, ...rest }) => rest);
        setRowStatus(({ [idx]: _b, ...rest }) => rest);
        setRowMsg(({ [idx]: _c, ...rest }) => rest);
    };
    const updateField = (idx, key, value) => setForms((prev) => {
        const next = [...prev];
        const v = key === "phone" ? digitsOnly(value)
            : key === "gender" ? value
                : value;
        next[idx][key] = v;
        return next;
    });
    // POST 검증(모두 필요)
    const validateCreate = (row) => {
        const e = [];
        if (!row.name?.trim())
            e.push("name 필수");
        if (!row.phone?.trim())
            e.push("phone(숫자만) 필수");
        if (row.gender !== "male" && row.gender !== "female")
            e.push("gender=male|female");
        if (!isYYYYMMDD(row.birthdate || ""))
            e.push("birthdate 형식(YYYY-MM-DD)");
        if (!row.relation?.trim())
            e.push("relation 필수");
        return e;
    };
    // PUT 검증(mid 필요, 빈 값은 전송 않음)
    const validateUpdate = (row) => {
        const e = [];
        if (!row.mid)
            e.push("memberId(mid) 없음");
        if (row.gender && row.gender !== "male" && row.gender !== "female")
            e.push("gender=male|female");
        if (row.birthdate && !isYYYYMMDD(row.birthdate))
            e.push("birthdate 형식(YYYY-MM-DD)");
        if (row.name !== undefined && row.name.trim() === "")
            e.push("name은 빈 문자열 불가");
        return e;
    };
    const createOne = async (idx) => {
        const row = forms[idx];
        if (row.mid) {
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: "이미 생성된 항목" }));
            return { idx, ok: false };
        }
        const errs = validateCreate(row);
        if (errs.length) {
            setRowErrors((p) => ({ ...p, [idx]: errs }));
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: "입력값 확인" }));
            return { idx, ok: false };
        }
        const payload = {
            name: row.name.trim(),
            phone: digitsOnly(row.phone),
            gender: row.gender,
            birthdate: row.birthdate.trim(),
            relation: row.relation.trim(),
        };
        try {
            setRowErrors((p) => ({ ...p, [idx]: [] }));
            setRowStatus((p) => ({ ...p, [idx]: "saving" }));
            setRowMsg((p) => ({ ...p, [idx]: "" }));
            const created = await createFamily(payload);
            const newMid = pickMid(created);
            if (newMid) {
                setForms((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], mid: newMid };
                    return next;
                });
            }
            else {
                await fetchUserProfile(); // 응답에 mid 없으면 동기화
            }
            setRowStatus((p) => ({ ...p, [idx]: "ok" }));
            setRowMsg((p) => ({ ...p, [idx]: "등록 성공" }));
            return { idx, ok: true };
        }
        catch (err) {
            const status = err?.response?.status;
            const raw = err?.response?.data ?? err?.message ?? "등록 실패";
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: typeof raw === "string" ? raw : "등록 실패" }));
            setRowErrors((p) => ({ ...p, [idx]: [...(p[idx] || []), `HTTP ${status ?? "ERR"}`] }));
            return { idx, ok: false };
        }
    };
    const updateOne = async (idx) => {
        const row = forms[idx];
        const errs = validateUpdate(row);
        if (errs.length) {
            setRowErrors((p) => ({ ...p, [idx]: errs }));
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: "입력값 확인" }));
            return { idx, ok: false };
        }
        const payload = {};
        if (row.name && row.name.trim().length > 0)
            payload.name = row.name.trim();
        if (row.phone && row.phone.trim().length > 0)
            payload.phone = digitsOnly(row.phone);
        if (row.gender)
            payload.gender = row.gender;
        if (row.birthdate)
            payload.birthdate = row.birthdate.trim();
        if (row.relation)
            payload.relation = row.relation.trim();
        if (Object.keys(payload).length === 0) {
            setRowStatus((p) => ({ ...p, [idx]: "idle" }));
            setRowMsg((p) => ({ ...p, [idx]: "변경할 값이 없습니다." }));
            return { idx, skipped: true };
        }
        try {
            setRowErrors((p) => ({ ...p, [idx]: [] }));
            setRowStatus((p) => ({ ...p, [idx]: "saving" }));
            setRowMsg((p) => ({ ...p, [idx]: "" }));
            await updateFamily(row.mid, payload);
            setRowStatus((p) => ({ ...p, [idx]: "ok" }));
            setRowMsg((p) => ({ ...p, [idx]: "업데이트 성공" }));
            return { idx, ok: true };
        }
        catch (err) {
            const status = err?.response?.status;
            const raw = err?.response?.data ?? err?.message ?? "업데이트 실패";
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: typeof raw === "string" ? raw : "업데이트 실패" }));
            setRowErrors((p) => ({ ...p, [idx]: [...(p[idx] || []), `HTTP ${status ?? "ERR"}`] }));
            return { idx, ok: false };
        }
    };
    const deleteOneRow = async (idx) => {
        const row = forms[idx];
        if (!row.mid) {
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: "memberId(mid) 없음" }));
            return { idx, ok: false };
        }
        try {
            setRowStatus((p) => ({ ...p, [idx]: "deleting" }));
            setRowMsg((p) => ({ ...p, [idx]: "" }));
            await deleteFamily(row.mid);
            removeRowLocal(idx);
            return { idx, ok: true };
        }
        catch (err) {
            const status = err?.response?.status;
            const raw = err?.response?.data ?? err?.message ?? "삭제 실패";
            setRowStatus((p) => ({ ...p, [idx]: "error" }));
            setRowMsg((p) => ({ ...p, [idx]: typeof raw === "string" ? raw : "삭제 실패" }));
            setRowErrors((p) => ({ ...p, [idx]: [...(p[idx] || []), `HTTP ${status ?? "ERR"}`] }));
            return { idx, ok: false };
        }
    };
    const saveAll = async () => {
        setSavingAll(true);
        const results = [];
        for (let i = 0; i < forms.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const r = forms[i].mid ? await updateOne(i) : await createOne(i);
            results.push(r);
        }
        const okCount = results.filter((r) => r?.ok).length;
        const errorCount = results.filter((r) => r && r.ok === false).length;
        if (okCount > 0)
            await fetchUserProfile();
        if (okCount > 0 && errorCount === 0)
            navigate(-1);
        else if (okCount > 0 && errorCount > 0)
            alert(`일부 성공 (${okCount}), 일부 실패 (${errorCount}).`);
        else if (okCount === 0 && errorCount > 0)
            alert("모두 실패했습니다.");
        else
            alert("처리할 항목이 없습니다.");
        setSavingAll(false);
    };
    return (_jsx(MainLayout, { headerProps: { title: "보호 대상자 관리", showBack: true }, showNav: true, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700", children: "\uB098\uC758 \uAC00\uC871 \uAD00\uB9AC" }), _jsx(Button, { type: "secondary", buttonName: "\uCD94\uAC00", onClick: addRow })] }), forms.map((f, idx) => {
                    const errs = rowErrors[idx] || [];
                    const status = rowStatus[idx] || "idle";
                    const msg = rowMsg[idx];
                    return (_jsxs(Card, { className: "p-4 space-y-3", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "text-sm font-bold", children: [f.name || "이름 미지정", status === "ok" && _jsx("span", { className: "ml-2 text-xs text-green-600", children: "\uC644\uB8CC" }), status === "saving" && _jsx("span", { className: "ml-2 text-xs text-gray-500", children: "\uC804\uC1A1 \uC911\u2026" }), status === "deleting" && _jsx("span", { className: "ml-2 text-xs text-gray-500", children: "\uC0AD\uC81C \uC911\u2026" })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Input, { label: "\uC774\uB984", value: f.name, onChange: (e) => updateField(idx, "name", e.target.value), placeholder: "\uD64D\uAE38\uB3D9" }), _jsx(Input, { label: "\uC804\uD654\uBC88\uD638", value: f.phone, onChange: (e) => updateField(idx, "phone", e.target.value), placeholder: "01012345678" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600 mb-1", children: "\uC131\uBCC4" }), _jsxs("select", { className: "w-full border rounded-md px-3 py-2 text-sm", value: f.gender, onChange: (e) => updateField(idx, "gender", e.target.value), children: [_jsx("option", { value: "", children: "\uC120\uD0DD\uC548\uD568" }), _jsx("option", { value: "male", children: "\uB0A8\uC131" }), _jsx("option", { value: "female", children: "\uC5EC\uC131" })] })] }), _jsx(Input, { label: "\uC0DD\uB144\uC6D4\uC77C (YYYY-MM-DD)", value: f.birthdate, onChange: (e) => updateField(idx, "birthdate", e.target.value), placeholder: "1970-05-15" }), _jsx(Input, { label: "\uAD00\uACC4", value: f.relation, onChange: (e) => updateField(idx, "relation", e.target.value), placeholder: "\uC544\uBC84\uC9C0 / \uC5B4\uBA38\uB2C8 / \uC774\uBAA8 / \uC0BC\uCD0C" })] }), msg && status === "error" && _jsx("div", { className: "text-xs text-red-600", children: msg }), errs.length > 0 && (_jsx("div", { className: "text-xs text-red-500", children: errs.map((m, i) => (_jsxs("div", { children: ["- ", m] }, i))) })), _jsx("div", { className: "flex justify-end gap-2", children: !forms[idx].mid ? (_jsx(Button, { type: "secondary", buttonName: status === "saving" ? "추가 중" : "추가하기", onClick: () => createOne(idx), disabled: status === "saving" || status === "deleting" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { type: "secondary", buttonName: status === "saving" ? "저장 중..." : "추가하기", onClick: () => updateOne(idx), disabled: status === "saving" || status === "deleting" }), _jsx(Button, { type: "secondary", buttonName: status === "deleting" ? "삭제 중..." : "삭제하기", onClick: () => deleteOneRow(idx), disabled: status === "saving" || status === "deleting" })] })) })] }, idx));
                }), _jsx("div", { className: "pb-4", children: _jsx(Button, { type: "primary", buttonName: savingAll ? "저장 중..." : "저장하기", className: "w-full h-12", onClick: saveAll, disabled: savingAll }) })] }) }));
}
