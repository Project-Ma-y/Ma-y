// src/components/maps/SearchSelectBox.tsx
import { useEffect, useMemo, useRef, useState } from "react";

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

/* ---------------- 공통 유틸 ---------------- */
const stripTags = (s: string) => (s || "").replace(/<[^>]+>/g, "");
const withProxy = (url: string) => {
  const px = import.meta.env.VITE_NAVER_CORS_PROXY as string | undefined;
  return px ? `${px}${url}` : url;
};

/* ---------------- 지오코딩: 지도 SDK ---------------- */
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

/* ---------------- 지역(장소) 검색: 프론트에서 직접 OpenAPI 호출 ----------------
   - 엔드포인트: https://openapi.naver.com/v1/search/local.json
   - 헤더: X-Naver-Client-Id / X-Naver-Client-Secret
   - 반환 mapx/mapy: WGS84 × 1e7 정수 → lng = mapx/1e7, lat = mapy/1e7
------------------------------------------------------------------------- */
// 프론트 OpenAPI 호출부 교체
// 🔧 지역(POI) 검색 — 프론트 단독 호출 + 에러 로깅
async function localSearchFront(q: string, signal?: AbortSignal): Promise<Suggest[]> {
  const id = import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID as string;
  const secret = import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET as string;
  if (!id || !secret) {
    console.warn("[local] 검색 API 키 없음(VITE_NAVER_SEARCH_CLIENT_ID/SECRET)");
    return []; // 프론트-only 고집이라면 여기서 바로 빈 배열 반환
  }

  const raw =
    "https://openapi.naver.com/v1/search/local.json?display=5&start=1&sort=random&query=" +
    encodeURIComponent(q.trim());
  const url = withProxy(raw);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "X-Naver-Client-Id": id,
        "X-Naver-Client-Secret": secret,
      },
      signal,
    });
  } catch (e) {
    console.warn("[local] 네트워크/프록시 오류:", e);
    return [];
  }

  if (!res.ok) {
    // CORS/403/429 등은 빈 배열로 흘러가면 '결과 없음'으로 오해됨 → 콘솔로 남겨 진단
    const text = await res.text().catch(() => "");
    console.warn("[local] HTTP", res.status, res.type, text);
    return [];
  }

  let data: any = {};
  try {
    data = await res.json();
  } catch (e) {
    console.warn("[local] JSON 파싱 실패:", e);
    return [];
  }

  const items: any[] = Array.isArray(data?.items) ? data.items : [];
  return items
    .map((v) => {
      const title = (v.title || "").replace(/<[^>]+>/g, "");
      const road = v.roadAddress || v.road_address || "";
      const jibun = v.address || v.jibunAddress || "";
      const mapx = Number(v.mapx);
      const mapy = Number(v.mapy);
      if (!Number.isFinite(mapx) || !Number.isFinite(mapy)) return null;
      const lng = mapx / 1e7;     // x = lng (WGS84 * 1e7)
      const lat = mapy / 1e7;     // y = lat (WGS84 * 1e7)
      return {
        title: title || road || jibun || "이름 없음",
        subtitle: road || jibun || undefined,
        lat, lng,
        address: road || jibun || title,
      } as Suggest;
    })
    .filter(Boolean) as Suggest[];
}


/* ---------------- 주소 지오코딩 결과 파서 ---------------- */
function toSuggestFromAddress(q: string, v: any): Suggest {
  const lat = Number(v.y);
  const lng = Number(v.x);
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

/* ---------------- 통합 검색 ---------------- */
async function searchAny(
  q: string,
  center?: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<Suggest[]> {
  const { naver } = window as any;
  const base = center ? { coords: new naver.maps.LatLng(center.lat, center.lng) } : {};

  // 1) 지역(POI) 검색 – 건물/역명 우선
  const fromLocal = await localSearchFront(q, signal).catch(() => []);

  // 2) 주소/키워드 지오코딩 – 보강
  let list = await geocodeOnce({ query: q.trim(), ...base, page: 1, count: 10 });
  if (!list.length) list = await geocodeOnce({ address: q.trim(), ...base, page: 1, count: 10 });
  const fromSDK = list.map((v) => toSuggestFromAddress(q, v));

  // 3) 합치고 중복 제거 (주소+좌표)
  const seen = new Set<string>();
  const merged = [...fromLocal, ...fromSDK].filter((s) => {
    const key = `${s.address}|${s.lat.toFixed(6)}|${s.lng.toFixed(6)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 4) center 가까운 순 정렬(있으면)
  if (center) {
    merged.sort((a, b) => {
      const da = Math.hypot(a.lat - center.lat, a.lng - center.lng);
      const db = Math.hypot(b.lat - center.lat, b.lng - center.lng);
      return da - db;
    });
  }
  return merged.slice(0, 10);
}

/* ---------------- 컴포넌트 ---------------- */
export default function SearchSelectBox({
  placeholder,
  value,
  mapCenter,
  onSelect,
  className = "",
}: Props) {
  const [q, setQ] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggest[]>([]);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const inFlight = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => setQ(value ?? ""), [value]);
  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

const doSearch = async () => {
  if (!canSearch) { setItems([]); setErr(null); return; }
  inFlight.current += 1;
  const token = inFlight.current;

  abortRef.current?.abort();
  const ctrl = new AbortController();
  abortRef.current = ctrl;

  setLoading(true);
  setErr(null);
  try {
    const list = await searchAny(q, mapCenter, ctrl.signal);
    if (token !== inFlight.current) return;
    setItems(list);
    setOpen(true);
    if (!list.length) setErr("검색 결과가 없습니다.");  // ← 진짜 빈 결과만
  } catch (e: any) {
    if (token !== inFlight.current) return;
    // ← 실패 원인 그대로 노출
    const msg = typeof e?.message === "string" ? e.message : "검색 실패";
    setErr(msg);
    setItems([]);
    setOpen(true);
    console.error("[searchAny fail]", e);
  } finally {
    if (token === inFlight.current) setLoading(false);
  }
};
console.log(import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID, import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET)


  useEffect(() => {
    if (!canSearch) {
      setItems([]);
      setErr(null);
      return;
    }
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
          }
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      {open && (items.length > 0 || loading || err) && (
        <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border bg-white shadow max-h-72 overflow-auto">
          {loading && <div className="px-3 py-2 text-sm text-gray-500">검색 중…</div>}
          {!loading && err && <div className="px-3 py-2 text-sm text-red-500">{err}</div>}
          {!loading &&
            !err &&
            items.map((it, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(it);
                  setQ(it.address);
                  setOpen(false);
                }}
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
