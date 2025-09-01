// src/components/maps/SearchSelectBox.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api"; // ✅ axios 인스턴스 (이미 프로젝트에 있음)

type Suggest = {
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  address: string;
};

interface Props {
  placeholder: string;
  value: string;
  mapCenter?: { lat: number; lng: number };
  onSelect: (s: Suggest) => void;
  className?: string;
}

// -------------------- 기존 geocodeOnce 그대로 사용 --------------------

async function geocodeOnce(opts: any): Promise<any[]> {
  const { naver } = window as any;
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => { if (!settled) { settled = true; resolve([]); } }, 4000);
    naver.maps.Service.geocode(opts, (status: any, resp: any) => {
      if (settled) return;
      clearTimeout(timer);
      if (status !== naver.maps.Service.Status.OK) return resolve([]);
      resolve(resp?.v2?.addresses ?? []);
    });
  });
}

// ✅ 새로 추가: 네이버 지역(local) 검색 프록시 호출
async function localSearchOnce(q: string): Promise<any[]> {
  try {
    const res = await api.get("/naver/local", { params: { q } });
    return res.data?.items ?? [];
  } catch {
    return [];
  }
}

function stripTags(s: string) {
  return (s || "").replace(/<[^>]+>/g, "");
}

function toSuggestFromAddress(q: string, v: any): Suggest {
const lng = Number(v.mapx) / 1e7;
const lat = Number(v.mapy) / 1e7;

  const road = v.roadAddress || "";
  const jibun = v.jibunAddress || "";
  return {
    title: road || jibun || v.englishAddress || q,
    subtitle: road && jibun ? jibun : undefined,
    lat,
    lng,
    address: road || jibun || v.englishAddress || q,
  };
}

// ✅ 지역(local) API 아이템 → Suggest (WGS84 1e7 스케일 반영)
function toSuggestFromLocalItem(v: any): Suggest | null {
  // title에는 <b>태그 등 HTML이 섞여 올 수 있음 → 제거
  const stripTags = (s: string) => (s || "").replace(/<[^>]+>/g, "");

  const title = stripTags(v.title || v.name || "");
  const road = v.roadAddress || v.road_address || "";
  const jibun = v.address || v.jibunAddress || "";

  // 2023-08-25 이후: mapx/mapy는 WGS84 * 1e7 (정수)
  const mapx = Number(v.mapx);
  const mapy = Number(v.mapy);
  if (!Number.isFinite(mapx) || !Number.isFinite(mapy)) return null;

  const lng = mapx / 1e7; // x = longitude
  const lat = mapy / 1e7; // y = latitude

  return {
    title: title || road || jibun,
    subtitle: road || jibun || undefined,
    lat,
    lng,
    // 주소가 없으면 장소명으로 대체
    address: road || jibun || title,
  };
}


async function searchAny(q: string, center?: { lat: number; lng: number }): Promise<Suggest[]> {
  const { naver } = window as any;
  const base = center ? { coords: new naver.maps.LatLng(center.lat, center.lng) } : {};
  // 1) 주소/키워드 지오코딩
  let list = await geocodeOnce({ query: q.trim(), ...base, page: 1, count: 10 });
  if (!list.length) {
    list = await geocodeOnce({ address: q.trim(), ...base, page: 1, count: 10 });
  }
  const fromAddr = list.map((v) => toSuggestFromAddress(q, v));

  // 2) 장소(POI) — 네이버 지역(local) 검색으로 보강
  const localItems = await localSearchOnce(q);
  const fromLocal = (localItems || [])
    .map((v: any) => toSuggestFromLocalItem(v))
    .filter(Boolean) as Suggest[];

  // 3) 합치고, 같은 위경도/주소는 간단히 중복 제거
  const seen = new Set<string>();
  const merged = [...fromLocal, ...fromAddr].filter((s) => {
    const k = `${s.address}|${s.lat.toFixed(6)}|${s.lng.toFixed(6)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // 4) (선택) center가 있으면 거리 순 정렬
  if (center) {
    merged.sort((a, b) => {
      const da = Math.hypot(a.lat - center.lat, a.lng - center.lng);
      const db = Math.hypot(b.lat - center.lat, b.lng - center.lng);
      return da - db;
    });
  }

  return merged.slice(0, 10);
}

export default function SearchSelectBox({ placeholder, value, mapCenter, onSelect, className = "" }: Props) {
  const [q, setQ] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggest[]>([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const inFlight = useRef(0);

  useEffect(() => setQ(value ?? ""), [value]);
  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  const doSearch = async () => {
    if (!canSearch) {
      setItems([]); setErr(null); return;
    }
    inFlight.current += 1;
    const token = inFlight.current;
    setLoading(true); setErr(null);
    try {
      const list = await searchAny(q, mapCenter);
      if (token !== inFlight.current) return;
      setItems(list);
      if (!list.length) setErr("검색 결과가 없습니다.");
      setOpen(true);
    } catch {
      if (token !== inFlight.current) return;
      setErr("검색 실패. 잠시 후 다시 시도해주세요.");
      setItems([]); setOpen(true);
    } finally {
      if (token === inFlight.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!canSearch) { setItems([]); setErr(null); return; }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(doSearch, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, mapCenter?.lat, mapCenter?.lng]);

  return (
    <div className={`relative ${className}`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => (items.length || err) && setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } }}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      {open && (items.length > 0 || loading || err) && (
        <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border bg-white shadow max-h-72 overflow-auto">
          {loading && <div className="px-3 py-2 text-sm text-gray-500">검색 중…</div>}
          {!loading && err && <div className="px-3 py-2 text-sm text-red-500">{err}</div>}
          {!loading && !err && items.map((it, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onSelect(it); setQ(it.address); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              <div className="text-sm font-medium">{it.title}</div>
              {it.subtitle && <div className="text-xs text-gray-500">{it.subtitle}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
