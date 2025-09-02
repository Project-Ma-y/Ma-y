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
  mapClassName?: string;
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

  // 마지막 포커스 (지도 클릭 시 적용 대상)
  const lastFocusedRef = useRef<"dep" | "des">("dep");

  // 상태 + 현재값 ref (클로저 최신화)
  const [departure, _setDeparture] = useState<Place>(initialDeparture);
  const [destination, _setDestination] = useState<Place>(initialDestination);
  const departureRef = useRef<Place>(initialDeparture);
  const destinationRef = useRef<Place>(initialDestination);

  const setDeparture = (next: Place) => {
    departureRef.current = next;
    _setDeparture(next);
  };
  const setDestination = (next: Place) => {
    destinationRef.current = next;
    _setDestination(next);
  };

  const emit = (nextDep?: Place, nextDes?: Place) => {
    // 최신값으로 항상 emit
    const d = nextDep ?? departureRef.current;
    const t = nextDes ?? destinationRef.current;
    onChange({ departure: d, destination: t });
  };

  const setMarkerPosition = (which: "dep" | "des", pos: LatLng | null) => {
    const ref = which === "dep" ? depMarkerRef : desMarkerRef;
    if (!map) return;
    if (!ref.current) {
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

  const reverseGeocode = (pos: LatLng): Promise<string | undefined> =>
    new Promise((resolve) => {
      if (!geocoderRef.current) return resolve(undefined);
      geocoderRef.current.geocode({ location: pos }, (res, status) => {
        if (status === "OK" && res && res[0]) resolve(res[0].formatted_address ?? "");
        else resolve(undefined);
      });
    });

  useEffect(() => {
    (async () => {
      await loadGoogleMaps({ libraries: ["places", "marker", "geocoding"] });

      const center =
        initialDeparture.coord ??
        initialDestination.coord ?? { lat: 37.5665, lng: 126.9780 };

      const _map = new google.maps.Map(mapRef.current!, { center, zoom: 14 });
      setMap(_map);

      try {
        geocoderRef.current = new google.maps.Geocoder();
      } catch {
        geocoderRef.current = null;
      }

      if (initialDeparture.coord) setMarkerPosition("dep", initialDeparture.coord);
      if (initialDestination.coord) setMarkerPosition("des", initialDestination.coord);

      // 지도 클릭 → 최근 포커스 대상 업데이트
      _map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const pos = e.latLng.toJSON();

        if (lastFocusedRef.current === "dep") {
          setMarkerPosition("dep", pos);
          const addr = (await reverseGeocode(pos)) ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
          const next = { coord: pos, address: addr };
          setDeparture(next);
          emit(next, undefined); // ✅ 다른 쪽 보존
        } else {
          setMarkerPosition("des", pos);
          const addr = (await reverseGeocode(pos)) ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
          const next = { coord: pos, address: addr };
          setDestination(next);
          emit(undefined, next); // ✅ 다른 쪽 보존
        }
      });

      // Autocomplete (클래식) – ref 기반으로 최신값 emit
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
          emit(next, undefined); // ✅ 도착지 유지
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
          emit(undefined, next); // ✅ 출발지 유지
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 수동 입력도 최신값 보존하도록 수정
  const onInputChange = (which: "dep" | "des") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (which === "dep") {
      const next = { ...departureRef.current, address: v };
      setDeparture(next);
      emit(next, undefined);
    } else {
      const next = { ...destinationRef.current, address: v };
      setDestination(next);
      emit(undefined, next);
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
      <div
     ref={mapRef}
     className={clsx("w-full rounded-xl", mapClassName ?? "h-[60vh]")}
    />
      <p className="text-xs text-gray-500">팁: 지도 클릭은 최근에 포커스된 입력(출발/도착)에 적용됩니다.</p>
    </div>
  );
}
