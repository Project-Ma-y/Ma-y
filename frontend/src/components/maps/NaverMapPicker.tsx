// src/components/maps/NaverMapPicker.tsx
import { useEffect, useRef, useState } from "react";
import { loadNaverMap } from "@/utils/loadNaverMap";
import SearchSelectBox from "./SearchSelectBox";

type Coord = { lat: number; lng: number };
type Place = { coord: Coord | null; address: string };

interface Props {
  initialDeparture?: Place;
  initialDestination?: Place;
  onChange: (data: { departure: Place; destination: Place }) => void;
}

export default function NaverMapPicker({
  initialDeparture,
  initialDestination,
  onChange,
}: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const depMarker = useRef<any>(null);
  const dstMarker = useRef<any>(null);

  const [selectMode, setSelectMode] = useState<"departure" | "destination">("departure");
  const [departure, setDeparture] = useState<Place>(
    initialDeparture ?? { coord: null, address: "" }
  );
  const [destination, setDestination] = useState<Place>(
    initialDestination ?? { coord: null, address: "" }
  );

  // 지도 중심좌표 (검색 가중치용)
  const [mapCenter, setMapCenter] = useState<Coord | undefined>(undefined);

  // 상위로 변경 통지
  useEffect(() => {
    onChange({ departure, destination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departure, destination]);

  // 역지오코딩
  const reverse = async (lat: number, lng: number): Promise<string> =>
    new Promise((resolve) => {
      const { naver } = window as any;
      naver.maps.Service.reverseGeocode(
        { coords: new naver.maps.LatLng(lat, lng) },
        (status: any, resp: any) => {
          if (status !== naver.maps.Service.Status.OK) return resolve("");
          const r = resp.v2?.addresses?.[0];
          resolve(r?.roadAddress || r?.jibunAddress || r?.englishAddress || "");
        }
      );
    });

  // 마커 설정 헬퍼
  const setMarker = (which: "dep" | "dst", lat: number, lng: number) => {
    const { naver } = window as any;
    const pos = new naver.maps.LatLng(lat, lng);
    const iconBlue =
      '<div style="padding:4px 8px;border-radius:12px;background:#2563eb;color:#fff;font-size:12px">출발</div>';
    const iconGreen =
      '<div style="padding:4px 8px;border-radius:12px;background:#16a34a;color:#fff;font-size:12px">도착</div>';

    if (which === "dep") {
      if (!depMarker.current) {
        depMarker.current = new naver.maps.Marker({
          position: pos,
          map: map.current,
          icon: { content: iconBlue, anchor: new naver.maps.Point(20, 20) },
        });
      } else depMarker.current.setPosition(pos);
    } else {
      if (!dstMarker.current) {
        dstMarker.current = new naver.maps.Marker({
          position: pos,
          map: map.current,
          icon: { content: iconGreen, anchor: new naver.maps.Point(20, 20) },
        });
      } else dstMarker.current.setPosition(pos);
    }
  };

  // 지도 준비
  useEffect(() => {
    let detachClick: any, detachIdle: any;

    (async () => {
      await loadNaverMap();
      const { naver } = window as any;

      const initCenter = new naver.maps.LatLng(
        initialDeparture?.coord?.lat ?? 37.5666805,
        initialDeparture?.coord?.lng ?? 126.9784147
      );

      map.current = new naver.maps.Map(mapEl.current!, {
        center: initCenter,
        zoom: 15,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      });

      // 최초 center 세팅
      const c0 = map.current.getCenter();
      setMapCenter({ lat: c0.y, lng: c0.x });

      // idle 시 center 추적
      detachIdle = naver.maps.Event.addListener(map.current, "idle", () => {
        const c = map.current.getCenter();
        setMapCenter({ lat: c.y, lng: c.x });
      });

      // 초기 값 마커 표시
      if (initialDeparture?.coord)
        setMarker("dep", initialDeparture.coord.lat, initialDeparture.coord.lng);
      if (initialDestination?.coord)
        setMarker("dst", initialDestination.coord.lat, initialDestination.coord.lng);

      // 지도 클릭으로 선택
      const h = naver.maps.Event.addListener(map.current, "click", async (e: any) => {
        const lat = e.coord.y;
        const lng = e.coord.x;
        const address = await reverse(lat, lng);

        if (selectMode === "departure") {
          setDeparture({ coord: { lat, lng }, address });
          setMarker("dep", lat, lng);
          setSelectMode("destination");
        } else {
          setDestination({ coord: { lat, lng }, address });
          setMarker("dst", lat, lng);
        }
      });
      detachClick = () => naver.maps.Event.removeListener(h);
    })();

    return () => {
      const { naver } = window as any;
      detachClick && detachClick();
      detachIdle && naver?.maps?.Event?.removeListener(detachIdle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* 상단 검색 (출발/도착) */}
     <div className="absolute top-3 left-0 right-0 z-20">
  <div className="mx-auto w-full max-w-[520px] px-3 space-y-2">
    <div className="flex gap-2">
      <SearchSelectBox
        placeholder="출발지 검색 (예: 종각역, 경희대병원)"
        value={departure.address}
        mapCenter={mapCenter}
        onSelect={(s) => {
          const { naver } = window as any;
          setDeparture({ coord: { lat: s.lat, lng: s.lng }, address: s.address });
          setMarker("dep", s.lat, s.lng);
          map.current?.setCenter(new naver.maps.LatLng(s.lat, s.lng));
          setSelectMode("destination");
        }}
        className="flex-1"
      />
      <button
        className={`px-3 rounded-xl text-xs border ${selectMode === "departure" ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
        onClick={() => setSelectMode("departure")}
      >
        출발지
      </button>
    </div>

    <div className="flex gap-2">
      <SearchSelectBox
        placeholder="도착지 검색 (예: 서울대병원, 한국외대)"
        value={destination.address}
        mapCenter={mapCenter}
        onSelect={(s) => {
          const { naver } = window as any;
          setDestination({ coord: { lat: s.lat, lng: s.lng }, address: s.address });
          setMarker("dst", s.lat, s.lng);
          map.current?.setCenter(new naver.maps.LatLng(s.lat, s.lng));
          setSelectMode("destination");
        }}
        className="flex-1"
      />
      <button
        className={`px-3 rounded-xl text-xs border ${selectMode === "destination" ? "bg-green-600 text-white border-green-600" : "bg-white"}`}
        onClick={() => setSelectMode("destination")}
      >
        도착지
      </button>
    </div>
  </div>
</div>

      {/* 지도 */}
      <div ref={mapEl} className="w-full h-[60vh] bg-gray-200 rounded-t-xl" />
    </div>
  );
}
