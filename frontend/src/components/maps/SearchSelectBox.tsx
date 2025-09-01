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

/* ========== 유틸 ========== */
const stripTags = (s: string) => (s || "").replace(/<[^>]+>/g, "");

/** (선택) CORS 회피용 임시 프록시 — 개발/테스트용만 권장
 *  .env.local: VITE_NAVER_CORS_PROXY=https://cors.isomorphic-git.org/
 */
const withProxy = (url: string) => {
  const px = import.meta.env.VITE_NAVER_CORS_PROXY as string | undefined;
  return px ? `${px}${url}` : url;
};

/** 런타임 임시 키 주입 허용(재빌드 없이 테스트 가능)
 *  콘솔에서:
 *    window.__NAVER_ID = "YOUR_CLIENT_ID";
 *    window.__NAVER_SECRET = "YOUR_CLIENT_SECRET";
 */
function getSearchApiKeys() {
  const w = window as any;
  const id =
    import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID ||
    w.__NAVER_ID ||
    "";
  const secret =
    import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET ||
    w.__NAVER_SECRET ||
    "";
  return { id, secret };
}

/* ========== 지도 SDK 지오코딩 (주소/키워드) ========== */
async function geocodeOnce(opts: any): Promise<any[]> {
  const { naver } = window as any;
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve([]);
      }
    }, 4000);
    naver.maps.Service.geocode(opts, (status: any, resp: any) => {
      if (settled) return;
      clearTimeout(timer);
      if (status !== naver.maps.Service.Status.OK) return resolve([]);
      resolve(resp?.v2?.addresses ?? []);
    });
  });
}

/* ========== (가능하면) SDK place 검색 폴백 ==========
   SDK 버전에 따라 없을 수 있으므로 런타임에서 안전하게 탐지 */
async function placeSearchOnce(q: string, center?: { lat: number; lng: number }): Promise<any[]> {
  const { naver } = window as any;
  const Svc = naver?.maps?.Service;
  if (!Svc) return [];
  const fn = (Svc as any).search || (Svc as any).placeSearch || (Svc as any).searchPoi || null;
  if (!fn) return [];
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => { if (!settled) { settled = true; resolve([]); } }, 4000);
    const opts: any = { query: q.trim() };
    if (center) opts.coords = new naver.maps.LatLng(center.lat, center.lng);
    fn.call(Svc, opts, (status: any, resp: any) => {
      if (settled) return;
      clearTimeout(timer);
      if (status !== naver.maps.Service.Status.OK) return resolve([]);
      const items = resp?.result?.items ?? resp?.v2?.addresses ?? resp?.places ?? [];
      resolve(items);
    });
  });
}

function toSuggestFromPlace(q: string, v: any): Suggest | null {
  const name = v.title || v.name || v.placeName || v.display || q;
  const road = v.roadAddress || v.address || v.road_address || "";
  const jibun = v.jibunAddress || v.jibun_address || "";
  const lat = Number(v.y || v.lat || v.latitude);
  const lng = Number(v.x || v.lng || v.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    title: name,
    subtitle: road || jibun || undefined,
    lat, lng,
    address: road || jibun || name,
  };
}

/* ========== 네이버 검색 API(지역) – 프론트에서 직접 호출 (키 없으면 조용히 패스) ========== */
async function localSearchFront(q: string, signal?: AbortSignal): Promise<Suggest[]> {
  const { id, secret } = getSearchApiKeys();
  if (!id || !secret) {
    // 🔸 키 없으면 조용히 스킵 (지오코딩/SDK place가 대신 동작)
    return [];
  }
  const raw =
    "https://openapi.naver.com/v1/search/local.json?display=5&start=1&sort=random&query=" +
    encodeURIComponent(q.trim());
  const url = withProxy(raw);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Naver-Client-Id": id,
        "X-Naver-Client-Secret": secret,
      },
      signal,
    });
  } catch {
    return []; // 네트워크/CORS 실패는 조용히 패스
  }

  if (!res.ok) {
    // 403/429 등도 폴백을 위해 조용히 패스
    return [];
  }

  const data = await res.json().catch(() => ({}));
  const items: any[] = Array.isArray(data?.items) ? data.items : [];
  return items
    .map((v) => {
      const title = stripTags(v.title || "");
      const road = v.roadAddress || v.road_address || "";
      const jibun = v.address || v.jibunAddress || "";
      const mapx = Number(v.mapx);
      const mapy = Number(v.mapy);
      if (!Number.isFinite(mapx) || !Number.isFinite(mapy)) return null;
      // 지역 API 좌표: WGS84 × 1e7
      const lng = mapx / 1e7;
      const lat = mapy / 1e7;
      return {
        title: title || road || jibun || "이름 없음",
        subtitle: road || jibun || undefined,
        lat, lng,
        address: road || jibun || title,
      } as Suggest;
    })
    .filter(Boolean) as Suggest[];
}

/* ========== 지도 SDK 지오코딩 결과 → Suggest 변환 ========== */
function toSuggestFromAddress(q: string, v: any): Suggest {
  const lat = Number(v.y);
  const lng = Number(v.x);
  const road = v.roadAddress || "";
  const jibun = v.jibunAddress || "";
  return {
    title: road || jibun || v.englishAddress || q,
    subtitle: road && jibun ? jibun : undefined,
    lat, lng,
    address: road || jibun || v.englishAddress || q,
  };
}

/* ========== 통합 검색 ========== */
async function searchAny(
  q: string,
  center?: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<Suggest[]> {
  const { naver } = window as any;
  const base = center ? { coords: new naver.maps.LatLng(center.lat, center.lng) } : {};

  // 1) 지역(POI) – OpenAPI (키 있으면)
  const fromLocal = await localSearchFront(q, signal).catch(() => []);

  // 2) (키 없거나 실패 시) SDK place 폴백
  let fromPlace: Suggest[] = [];
  if (!fromLocal.length) {
    const places = await placeSearchOnce(q, center);
    fromPlace = places.map((v) => toSuggestFromPlace(q, v)).filter(Boolean) as Suggest[];
  }

  // 3) 주소/키워드 – 지오코딩 보강
  let list = await geocodeOnce({ query: q.trim(), ...base, page: 1, count: 10 });
  if (!list.length) list = await geocodeOnce({ address: q.trim(), ...base, page: 1, count: 10 });
  const fromSDK = list.map((v) => toSuggestFromAddress(q, v));

  // 4) 병합 + 중복 제거
  const seen = new Set<string>();
  const merged = [...fromLocal, ...fromPlace, ...fromSDK].filter((s) => {
    const key = `${s.address}|${s.lat.toFixed(6)}|${s.lng.toFixed(6)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 5) center 기준 가까운 순
  if (center) {
    merged.sort((a, b) => {
      const da = Math.hypot(a.lat - center.lat, a.lng - center.lng);
      const db = Math.hypot(b.lat - center.lat, b.lng - center.lng);
      return da - db;
    });
  }

  return merged.slice(0, 10);
}

/* ========== 컴포넌트 ========== */
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

  // 필요하면 1글자로 낮춰서 테스트
  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  const doSearch = async () => {
    if (!canSearch) {
      setItems([]);
      setErr(null);
      return;
    }
    inFlight.current += 1;
    const token = inFlight.current;

    // 이전 요청 취소
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
      if (!list.length) setErr("검색 결과가 없습니다.");
    } catch (e: any) {
      if (token !== inFlight.current) return;
      const msg = typeof e?.message === "string" ? e.message : "검색 실패. 잠시 후 다시 시도해주세요.";
      setErr(msg);
      setItems([]);
      setOpen(true);
      console.error("[searchAny fail]", e);
    } finally {
      if (token === inFlight.current) setLoading(false);
    }
  };

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
