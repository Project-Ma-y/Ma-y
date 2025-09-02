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
  const depPickerRef = useRef<any>(null); // PlaceAutocompleteElement
  const desPickerRef = useRef<any>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const depMarkerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
  const desMarkerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const lastFocusedRef = useRef<"dep" | "des">("dep");
  const [departure, setDeparture] = useState<Place>(initialDeparture);
  const [destination, setDestination] = useState<Place>(initialDestination);

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

  const emit = (d: Place, t: Place) => onChange({ departure: d, destination: t });

  const reverseGeocode = (pos: LatLng): Promise<string | undefined> =>
    new Promise((resolve) => {
      if (!geocoderRef.current) return resolve(undefined);
      geocoderRef.current.geocode({ location: pos }, (res, status) => {
        // 권한 미설정/요금제/리퍼러 문제 등으로 실패 시 주소 없이 좌표만 반환
        if (status === "OK" && res && res[0]) resolve(res[0].formatted_address ?? "");
        else resolve(undefined);
      });
    });

 useEffect(() => {
    (async () => {
      // ✅ SDK 로드
      await loadGoogleMaps({ libraries: ["places", "marker"] }); // geocoding은 선택

      // ✅ Web Components 등록 (중요)
      //   maps JS가 로드되어도 컴포넌트는 importLibrary 호출로 등록해야 함
      if ((google.maps as any).importLibrary) {
        await (google.maps as any).importLibrary("places");
      }

      const center =
        initialDeparture.coord ??
        initialDestination.coord ?? { lat: 37.5665, lng: 126.9780 };

      const _map = new google.maps.Map(mapRef.current!, { center, zoom: 14 });
      setMap(_map);

      // (선택) 지오코더 – 권한 없으면 사용 안 함
      try {
        geocoderRef.current = new google.maps.Geocoder();
      } catch {
        geocoderRef.current = null;
      }

      if (initialDeparture.coord) setMarkerPosition("dep", initialDeparture.coord);
      if (initialDestination.coord) setMarkerPosition("des", initialDestination.coord);

      _map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const pos = e.latLng.toJSON();

        const tryReverse = async () => {
          if (!geocoderRef.current) return undefined;
          return new Promise<string | undefined>((resolve) => {
            geocoderRef.current!.geocode({ location: pos }, (res, status) => {
              if (status === "OK" && res && res[0]) resolve(res[0].formatted_address ?? "");
              else resolve(undefined);
            });
          });
        };

        if (lastFocusedRef.current === "dep") {
          setMarkerPosition("dep", pos);
          // ✅ 지오코딩 실패 시 좌표 문자열로 대체
          const addr = (await tryReverse()) ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
          const next = { coord: pos, address: addr };
          setDeparture(next); emit(next, destination);
        } else {
          setMarkerPosition("des", pos);
          const addr = (await tryReverse()) ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
          const next = { coord: pos, address: addr };
          setDestination(next); emit(departure, next);
        }
      });

      // ✅ PlaceAutocompleteElement (gmpx-*) 생성
      const depEl = document.createElement("gmpx-place-autocomplete") as any;
      const desEl = document.createElement("gmpx-place-autocomplete") as any;

      depEl.setAttribute("placeholder", "출발지 검색 (예: 서울시청)");
      desEl.setAttribute("placeholder", "도착지 검색 (예: 서울역)");
      depEl.setAttribute("componentRestrictions", JSON.stringify({ country: ["kr"] }));
      desEl.setAttribute("componentRestrictions", JSON.stringify({ country: ["kr"] }));

      depEl.addEventListener("focus", () => (lastFocusedRef.current = "dep"));
      desEl.addEventListener("focus", () => (lastFocusedRef.current = "des"));

      const onPlaceSelect = async (which: "dep" | "des", e: any) => {
        const place = e?.detail?.place;
        if (!place) return;
        await place.fetchFields({ fields: ["formatted_address", "geometry"] });
        const loc = place.geometry?.location?.toJSON();
        const formatted = place.formatted_address ?? "";
        if (!loc) return;

        _map.panTo(loc);
        setMarkerPosition(which, loc);
        const next = { coord: loc, address: formatted };

        if (which === "dep") { setDeparture(next); emit(next, destination); }
        else { setDestination(next); emit(departure, next); }
      };

      depEl.addEventListener("gmp-placeselect", (e: any) => onPlaceSelect("dep", e));
      desEl.addEventListener("gmp-placeselect", (e: any) => onPlaceSelect("des", e));

      // 입력 UI 래핑
      const wrapper = document.createElement("div");
      wrapper.className = "grid grid-cols-1 md:grid-cols-2 gap-2 mb-3";
      wrapper.appendChild(depEl);
      wrapper.appendChild(desEl);

      const host = mapRef.current!.parentElement!;
      host.insertBefore(wrapper, mapRef.current!);

      depPickerRef.current = depEl;
      desPickerRef.current = desEl;

      if (initialDeparture.address) depEl.value = initialDeparture.address;
      if (initialDestination.address) desEl.value = initialDestination.address;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx("space-y-2", className)}>
      <div ref={mapRef} className="h-96 w-full rounded-xl" />
      <p className="text-xs text-gray-500">팁: 지도 클릭은 최근에 포커스된 입력(출발/도착)에 적용됩니다.</p>
    </div>
  );
}
