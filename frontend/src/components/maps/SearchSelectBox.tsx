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

// 공통: geocode 호출 (4초 타임아웃)
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

// (있으면) 장소 검색 호출 – 메서드명을 런타임에서 탐지
async function placeSearchOnce(q: string, center?: { lat: number; lng: number }): Promise<any[]> {
  const { naver } = window as any;
  const Svc = naver?.maps?.Service;
  if (!Svc) return [];
  const fn =
    (Svc as any).search ||
    (Svc as any).placeSearch ||
    (Svc as any).searchPoi ||
    null;
  if (!fn) return [];

  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve([]);
      }
    }, 4000);

    const opts: any = { query: q.trim() };
    if (center) {
      opts.coords = new naver.maps.LatLng(center.lat, center.lng);
    }

    fn.call(Svc, opts, (status: any, resp: any) => {
      if (settled) return;
      clearTimeout(timer);
      if (status !== naver.maps.Service.Status.OK) return resolve([]);
      // 응답 포맷이 SDK 버전에 따라 다를 수 있으므로 최대한 안전하게 파싱
      const items =
        resp?.result?.items ??
        resp?.v2?.addresses ?? // 혹시 동일 구조일 때
        resp?.places ??
        [];
      resolve(items);
    });
  });
}

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

function toSuggestFromPlace(q: string, v: any): Suggest | null {
  // 가능한 키들을 최대한 커버 (장소 응답 케이스별)
  const name = v.title || v.name || v.placeName || v.display || q;
  const road = v.roadAddress || v.address || v.road_address || "";
  const jibun = v.jibunAddress || v.jibun_address || "";
  const lat = Number(v.y || v.lat || v.latitude);
  const lng = Number(v.x || v.lng || v.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return {
    title: name,
    subtitle: road || jibun || undefined,
    lat,
    lng,
    address: road || jibun || name, // 주소가 없으면 장소명으로 세팅
  };
}

async function searchAny(q: string, center?: { lat: number; lng: number }): Promise<Suggest[]> {
  // 1) 주소/키워드 지오코딩
  const base = center ? { coords: new (window as any).naver.maps.LatLng(center.lat, center.lng) } : {};
  let list = await geocodeOnce({ query: q.trim(), ...base, page: 1, count: 10 });

  // 2) 주소 파라미터로 한 번 더
  if (!list.length) {
    list = await geocodeOnce({ address: q.trim(), ...base, page: 1, count: 10 });
  }

  let suggests = list.map((v) => toSuggestFromAddress(q, v));

  // 3) 여전히 부족하면 “장소 검색” 시도 (SDK가 제공하는 경우에 한함)
  if (!suggests.length) {
    const places = await placeSearchOnce(q, center);
    const s2 = places
      .map((v) => toSuggestFromPlace(q, v))
      .filter(Boolean) as Suggest[];
    suggests = s2;
  }

  return suggests;
}

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

  useEffect(() => setQ(value ?? ""), [value]);

  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  const doSearch = async () => {
    if (!canSearch) {
      setItems([]);
      setErr(null);
      return;
    }
    inFlight.current += 1;
    const token = inFlight.current;

    setLoading(true);
    setErr(null);
    try {
      const list = await searchAny(q, mapCenter);
      if (token !== inFlight.current) return;
      setItems(list.slice(0, 10));
      if (!list.length) setErr("검색 결과가 없습니다.");
      setOpen(true);
    } catch {
      if (token !== inFlight.current) return;
      setErr("검색 실패. 잠시 후 다시 시도해주세요.");
      setItems([]);
      setOpen(true);
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
        // ✅ 배경 흰색 고정
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
