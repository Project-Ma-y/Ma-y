// src/pages/ParentsManage.tsx
import React, { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api";

type Gender = "male" | "female";

interface ParentForm {
  mid?: string;
  name: string;
  phone: string;
  gender: "" | Gender;
  birthdate: string;
  relation: string;
}

type RowStatus = "idle" | "saving" | "ok" | "error" | "deleting";

const digitsOnly = (v: string) => v.replace(/\D/g, "");
const isYYYYMMDD = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const pickMid = (p: any): string | undefined =>
  p?.memberId ?? p?.member_id ?? p?.mid ?? p?.id ?? p?._id ?? undefined;

export default function ParentsManage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { parents?: ParentForm[] } };
  const { profile, fetchUserProfile } = useUserStore();

  const [forms, setForms] = useState<ParentForm[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string[]>>({});
  const [rowStatus, setRowStatus] = useState<Record<number, RowStatus>>({});
  const [rowMsg, setRowMsg] = useState<Record<number, string>>({});
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => {
    if (state?.parents?.length) {
      setForms(
        state.parents.map((p) => ({
          mid: p.mid,
          name: p.name ?? "",
          phone: digitsOnly(p.phone ?? ""),
          gender: (p.gender as Gender | "") ?? "",
          birthdate: p.birthdate ?? "",
          relation: p.relation ?? "",
        }))
      );
      return;
    }
    const base: ParentForm[] =
      (profile?.registeredFamily ?? []).map((p: any) => ({
        mid: pickMid(p),
        name: p.name ?? "",
        phone: digitsOnly(p.phone ?? ""),
        gender: (p.gender as Gender | "") ?? "",
        birthdate: p.birthdate ?? "",
        relation: p.relation ?? "",
      })) ?? [];
    setForms(base.length ? base : [{ mid: undefined, name: "", phone: "", gender: "", birthdate: "", relation: "" }]);
  }, [profile, state?.parents]);

  const addRow = () =>
    setForms((prev) => [...prev, { mid: undefined, name: "", phone: "", gender: "", birthdate: "", relation: "" }]);

  const removeRowLocal = (idx: number) => {
    setForms((prev) => prev.filter((_, i) => i !== idx));
    setRowErrors(({ [idx]: _a, ...rest }) => rest);
    setRowStatus(({ [idx]: _b, ...rest }) => rest);
    setRowMsg(({ [idx]: _c, ...rest }) => rest);
  };

  const update = (idx: number, key: keyof ParentForm, value: string) =>
    setForms((prev) => {
      const next = [...prev];
      const v =
        key === "phone" ? digitsOnly(value)
        : key === "gender" ? (value as Gender | "")
        : value;
      (next[idx] as any)[key] = v;
      return next;
    });

  const validateRowForCreate = (row: ParentForm): string[] => {
    const e: string[] = [];
    if (!row.name?.trim()) e.push("name 필수");
    if (!row.phone?.trim()) e.push("phone(숫자만) 필수");
    if (row.gender !== "male" && row.gender !== "female") e.push("gender=male|female");
    if (!isYYYYMMDD(row.birthdate || "")) e.push("birthdate 형식(YYYY-MM-DD)");
    if (!row.relation?.trim()) e.push("relation 필수");
    return e;
  };

  const validateRowForUpdate = (row: ParentForm): string[] => {
    const e: string[] = [];
    if (!row.mid) e.push("memberId(mid)가 없습니다.");
    if (row.gender && row.gender !== "male" && row.gender !== "female") e.push("gender=male|female");
    if (row.birthdate && !isYYYYMMDD(row.birthdate)) e.push("birthdate 형식(YYYY-MM-DD)");
    if (row.name !== undefined && row.name.trim() === "") e.push("name은 빈 문자열 불가");
    return e;
  };

  const createOne = async (idx: number) => {
    const row = forms[idx];
    if (row.mid) {
      setRowStatus((p) => ({ ...p, [idx]: "error" }));
      setRowMsg((p) => ({ ...p, [idx]: "이미 생성된 항목" }));
      return { idx, ok: false };
    }
    const errs = validateRowForCreate(row);
    if (errs.length) {
      setRowErrors((prev) => ({ ...prev, [idx]: errs }));
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "입력값 확인" }));
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
      const res = await api.post("/users/family", payload);
      const created = res.data;
      const newMid = pickMid(created);
      if (newMid) {
        setForms((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], mid: newMid };
          return next;
        });
      }
      setRowStatus((p) => ({ ...p, [idx]: "ok" }));
      setRowMsg((p) => ({ ...p, [idx]: "회원 생성 성공" }));
      return { idx, ok: true };
    } catch (err: any) {
      const status = err?.response?.status;
      const raw = err?.response?.data ?? err?.message ?? "생성 실패";
      setRowStatus((p) => ({ ...p, [idx]: "error" }));
      setRowMsg((p) => ({ ...p, [idx]: typeof raw === "string" ? raw : "생성 실패" }));
      setRowErrors((p) => ({ ...p, [idx]: [...(p[idx] || []), `HTTP ${status ?? "ERR"}`] }));
      return { idx, ok: false };
    }
  };

  const updateOne = async (idx: number) => {
    const row = forms[idx];
    const errs = validateRowForUpdate(row);
    if (errs.length) {
      setRowErrors((prev) => ({ ...prev, [idx]: errs }));
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "입력값 확인" }));
      return { idx, ok: false };
    }
    const payload: Record<string, any> = {};
    if (row.name && row.name.trim().length > 0) payload.name = row.name.trim();
    if (row.phone && row.phone.trim().length > 0) payload.phone = digitsOnly(row.phone);
    if (row.gender) payload.gender = row.gender;
    if (row.birthdate) payload.birthdate = row.birthdate.trim();
    if (row.relation) payload.relation = row.relation.trim();
    if (Object.keys(payload).length === 0) {
      setRowStatus((prev) => ({ ...prev, [idx]: "idle" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "변경할 값이 없습니다." }));
      return { idx, skipped: true };
    }
    try {
      setRowErrors((prev) => ({ ...prev, [idx]: [] }));
      setRowStatus((prev) => ({ ...prev, [idx]: "saving" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "" }));
      const res = await api.put(`/users/family/${row.mid}`, payload);
      if (res.status === 200) {
        setRowStatus((prev) => ({ ...prev, [idx]: "ok" }));
        setRowMsg((prev) => ({ ...prev, [idx]: "회원 업데이트 성공" }));
        return { idx, ok: true };
      }
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: `서버 응답 코드 ${res.status}` }));
      return { idx, ok: false };
    } catch (err: any) {
      const status = err?.response?.status;
      const raw = err?.response?.data ?? err?.message ?? "업데이트 실패";
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: typeof raw === "string" ? raw : "업데이트 실패" }));
      setRowErrors((prev) => ({ ...prev, [idx]: [...(prev[idx] || []), `HTTP ${status ?? "ERR"}`] }));
      return { idx, ok: false };
    }
  };

  const deleteOne = async (idx: number) => {
    const row = forms[idx];
    if (!row.mid) {
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "memberId(mid) 없음" }));
      return { idx, ok: false };
    }
    try {
      setRowStatus((prev) => ({ ...prev, [idx]: "deleting" }));
      setRowMsg((prev) => ({ ...prev, [idx]: "" }));
      const res = await api.delete(`/users/family/${row.mid}`);
      if (res.status === 200) {
        removeRowLocal(idx);
        return { idx, ok: true };
      }
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: `서버 응답 코드 ${res.status}` }));
      return { idx, ok: false };
    } catch (err: any) {
      const status = err?.response?.status;
      const raw = err?.response?.data ?? err?.message ?? "삭제 실패";
      setRowStatus((prev) => ({ ...prev, [idx]: "error" }));
      setRowMsg((prev) => ({ ...prev, [idx]: typeof raw === "string" ? raw : "삭제 실패" }));
      setRowErrors((prev) => ({ ...prev, [idx]: [...(prev[idx] || []), `HTTP ${status ?? "ERR"}`] }));
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
    const okCount = results.filter((r: any) => r?.ok).length;
    const errorCount = results.filter((r: any) => r && r.ok === false).length;
    if (okCount > 0) await fetchUserProfile();
    if (okCount > 0 && errorCount === 0) navigate(-1);
    else if (okCount > 0 && errorCount > 0) alert(`일부 성공 (${okCount}), 일부 실패 (${errorCount}).`);
    else if (okCount === 0 && errorCount > 0) alert("모두 실패했습니다.");
    else alert("처리할 항목이 없습니다.");
    setSavingAll(false);
  };

  return (
    <MainLayout headerProps={{ title: "보호 대상자 관리", showBack: true }} showNav={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">보호 대상자 생성/수정/삭제</h3>
          <Button type="secondary" buttonName="행 추가 (+)" onClick={addRow} />
        </div>

        {forms.map((f, idx) => {
          const errs = rowErrors[idx] || [];
          const status = rowStatus[idx] || "idle";
          const msg = rowMsg[idx];

          return (
            <Card key={idx} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">
                  {f.name || "이름 미지정"}
                  {f.mid ? (
                    <span className="ml-2 text-[10px] text-gray-400">mid: {f.mid}</span>
                  ) : (
                    <span className="ml-2 text-[10px] text-red-400">mid 없음(생성 필요)</span>
                  )}
                  {status === "ok" && <span className="ml-2 text-xs text-green-600">완료</span>}
                  {status === "saving" && <span className="ml-2 text-xs text-gray-500">전송 중…</span>}
                  {status === "deleting" && <span className="ml-2 text-xs text-gray-500">삭제 중…</span>}
                </div>
                <button
                  className="text-xs text-red-500 font-semibold"
                  onClick={() => removeRowLocal(idx)}
                  disabled={status === "saving" || status === "deleting"}
                >
                  행 제거(로컬)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="이름"
                  value={f.name}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  placeholder="홍길동"
                />
                <Input
                  label="전화번호(숫자만)"
                  value={f.phone}
                  onChange={(e) => update(idx, "phone", e.target.value)}
                  placeholder="01012345678"
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">성별</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={f.gender}
                    onChange={(e) => update(idx, "gender", e.target.value)}
                  >
                    <option value="">선택안함</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
                <Input
                  label="생년월일 (YYYY-MM-DD)"
                  value={f.birthdate}
                  onChange={(e) => update(idx, "birthdate", e.target.value)}
                  placeholder="1970-05-15"
                />
                <Input
                  label="관계"
                  value={f.relation}
                  onChange={(e) => update(idx, "relation", e.target.value)}
                  placeholder="아버지 / 어머니 / 이모 / 삼촌"
                />
              </div>

              {msg && status === "error" && <div className="text-xs text-red-600">{msg}</div>}
              {errs.length > 0 && (
                <div className="text-xs text-red-500">
                  {errs.map((m, i) => (
                    <div key={i}>- {m}</div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                {!forms[idx].mid ? (
                  <Button
                    type="secondary"
                    buttonName={status === "saving" ? "생성 중..." : "이 행 생성"}
                    onClick={() => createOne(idx)}
                    disabled={status === "saving" || status === "deleting"}
                  />
                ) : (
                  <>
                    <Button
                      type="secondary"
                      buttonName={status === "saving" ? "저장 중..." : "이 행 업데이트"}
                      onClick={() => updateOne(idx)}
                      disabled={status === "saving" || status === "deleting"}
                    />
                    <Button
                      type="secondary"
                      buttonName={status === "deleting" ? "삭제 중..." : "이 행 삭제"}
                      onClick={() => deleteOne(idx)}
                      disabled={status === "saving" || status === "deleting"}
                    />
                  </>
                )}
              </div>
            </Card>
          );
        })}

        <div className="pb-4">
          <Button
            type="primary"
            buttonName={savingAll ? "전체 저장 중..." : "전체 저장"}
            className="w-full h-12"
            onClick={saveAll}
            disabled={savingAll}
          />
        </div>
      </div>
    </MainLayout>
  );
}
