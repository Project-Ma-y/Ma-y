// src/components/maps/GoogleRoutePicker.tsx
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

type LatLng = { lat: number; lng: number };
type Place = { coord: LatLng | null; address: string };

type Props = {
  initialDeparture: Place;
  initialDestination: Place;
  onChange: (v: { departure: Place; destination: Place }) => void;
  className?: string;
};

export default function GoogleRoutePicker({
  initialDeparture,
  initialDestination,
  onChange,
  className,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const depInputRef = useRef<HTMLInputElement>(null);
  const desInputRef = useRef<HTMLInputElement>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const depMarkerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
  const desMarkerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // 마지막으로 포커스된 인풋(클릭 시 어느 포인트를 이동시킬지 판단)
  const lastFocusedRef = useRef<"dep" | "des">("dep");

  // 내부 상태
  const [departure, setDeparture] = useState<Place>(initialDeparture);
  const [destination, setDestination] = useState<Place>(initialDestination);

  // 공통: 마커 생성/업데이트 헬퍼
  const setMarkerPosition = (
    which: "dep" | "des",
    pos: LatLng | null,
  ) => {
    const ref = which === "dep" ? depMarkerRef : desMarkerRef;
    if (!map) return;
    if (!ref.current) {
      // AdvancedMarker 지원 여부
      const hasAdv = (google.maps as any).marker?.AdvancedMarkerElement;
      ref.current = hasAdv
        ? new (google.maps as any).marker.AdvancedMarkerElement({ map, position: pos ?? undefined })
        : new google.maps.Marker({ map, position: pos ?? undefined });
    } else {
      if (ref.current instanceof google.maps.Marker) {
        ref.current.setPosition(pos ?? undefined);
      } else {
        (ref.current as any).position = pos ?? undefined;
      }
    }
  };

  const emitChange = (nextDep: Place, nextDes: Place) => {
    onChange({ departure: nextDep, destination: nextDes });
  };

  const reverseGeocode = (pos: LatLng): Promise<string | undefined> =>
    new Promise((resolve) => {
      if (!geocoderRef.current) return resolve(undefined);
      geocoderRef.current.geocode({ location: pos }, (res, status) => {
        if (status === "OK" && res && res[0]) resolve(res[0].formatted_address ?? "");
        else resolve(undefined);
      });
    });

  // 초기 로드
  useEffect(() => {
    (async () => {
      await loadGoogleMaps({ libraries: ["places", "marker", "geocoding"] });

      // 중심 결정: 출발지/도착지 중 하나라도 있으면 그쪽으로
      const center =
        initialDeparture.coord ??
        initialDestination.coord ?? { lat: 37.5665, lng: 126.9780 };

      const _map = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 14,
      });
      setMap(_map);

      // 지오코더
      geocoderRef.current = new google.maps.Geocoder();

      // 초기 마커
      if (initialDeparture.coord) setMarkerPosition("dep", initialDeparture.coord);
      if (initialDestination.coord) setMarkerPosition("des", initialDestination.coord);

      // 맵 클릭으로 위치 선택
      _map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const pos = e.latLng.toJSON();

        if (lastFocusedRef.current === "dep") {
          setMarkerPosition("dep", pos);
          const addr = await reverseGeocode(pos);
          const next = { coord: pos, address: addr ?? departure.address };
          setDeparture(next);
          emitChange(next, destination);
        } else {
          setMarkerPosition("des", pos);
          const addr = await reverseGeocode(pos);
          const next = { coord: pos, address: addr ?? destination.address };
          setDestination(next);
          emitChange(departure, next);
        }
      });

      // 자동완성 바인딩
      if (depInputRef.current) {
        const ac = new google.maps.places.Autocomplete(depInputRef.current, {
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: ["kr"] },
        });
        depInputRef.current.addEventListener("focus", () => (lastFocusedRef.current = "dep"));
        ac.addListener("place_changed", () => {
          const p = ac.getPlace();
          const loc = p.geometry?.location?.toJSON();
          if (!loc) return;
          _map.panTo(loc);
          setMarkerPosition("dep", loc);
          const next = { coord: loc, address: p.formatted_address ?? "" };
          setDeparture(next);
          emitChange(next, destination);
        });
      }

      if (desInputRef.current) {
        const ac = new google.maps.places.Autocomplete(desInputRef.current, {
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: ["kr"] },
        });
        desInputRef.current.addEventListener("focus", () => (lastFocusedRef.current = "des"));
        ac.addListener("place_changed", () => {
          const p = ac.getPlace();
          const loc = p.geometry?.location?.toJSON();
          if (!loc) return;
          _map.panTo(loc);
          setMarkerPosition("des", loc);
          const next = { coord: loc, address: p.formatted_address ?? "" };
          setDestination(next);
          emitChange(departure, next);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 인풋 수동 입력 반영
  const onInputChange = (which: "dep" | "des") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (which === "dep") {
      const next = { ...departure, address: v };
      setDeparture(next);
      emitChange(next, destination);
    } else {
      const next = { ...destination, address: v };
      setDestination(next);
      emitChange(departure, next);
    }
  };

  return (
    <div className={clsx("space-y-3", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          ref={depInputRef}
          placeholder="출발지 검색 (예: 서울시청)"
          value={departure.address}
          onChange={onInputChange("dep")}
          onFocus={() => (lastFocusedRef.current = "dep")}
          className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2"
        />
        <input
          ref={desInputRef}
          placeholder="도착지 검색 (예: 서울역)"
          value={destination.address}
          onChange={onInputChange("des")}
          onFocus={() => (lastFocusedRef.current = "des")}
          className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2"
        />
      </div>
      <div ref={mapRef} className="h-96 w-full rounded-xl" />
      <p className="text-xs text-gray-500">
        팁: 지도 클릭은 최근에 포커스된 입력(출발/도착)에 적용됩니다.
      </p>
    </div>
  );
}
