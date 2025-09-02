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
      // places + marker (+ geocoding은 optional; 권한 없으면 fallback)
      await loadGoogleMaps({ libraries: ["places", "marker", "geocoding"] });

      const center =
        initialDeparture.coord ??
        initialDestination.coord ?? { lat: 37.5665, lng: 126.9780 };

      const _map = new google.maps.Map(mapRef.current!, { center, zoom: 14 });
      setMap(_map);

      geocoderRef.current = new google.maps.Geocoder();

      if (initialDeparture.coord) setMarkerPosition("dep", initialDeparture.coord);
      if (initialDestination.coord) setMarkerPosition("des", initialDestination.coord);

      // 맵 클릭 → 최근 포커스된 입력 대상에 적용
      _map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const pos = e.latLng.toJSON();

        if (lastFocusedRef.current === "dep") {
          setMarkerPosition("dep", pos);
          const addr = await reverseGeocode(pos);
          const next = { coord: pos, address: addr ?? departure.address };
          setDeparture(next);
          emit(next, destination);
        } else {
          setMarkerPosition("des", pos);
          const addr = await reverseGeocode(pos);
          const next = { coord: pos, address: addr ?? destination.address };
          setDestination(next);
          emit(departure, next);
        }
      });

      // ------- PlaceAutocompleteElement (신규 권장) -------
      // <gmpx-place-autocomplete> 를 직접 생성하여 바인딩
      const depEl = document.createElement("gmpx-place-autocomplete") as any;
      const desEl = document.createElement("gmpx-place-autocomplete") as any;

      depEl.setAttribute("placeholder", "출발지 검색 (예: 서울시청)");
      desEl.setAttribute("placeholder", "도착지 검색 (예: 서울역)");
      // 한국 제한
      depEl.setAttribute("componentRestrictions", JSON.stringify({ country: ["kr"] }));
      desEl.setAttribute("componentRestrictions", JSON.stringify({ country: ["kr"] }));

      // 포커스 추적
      depEl.addEventListener("focus", () => (lastFocusedRef.current = "dep"));
      desEl.addEventListener("focus", () => (lastFocusedRef.current = "des"));

      // 선택 이벤트
      const onPlaceSelect = async (which: "dep" | "des", e: any) => {
        const place = e?.detail?.place;
        if (!place) return;

        // 필요한 필드 로드
        await place.fetchFields({ fields: ["formatted_address", "geometry"] });
        const loc = place.geometry?.location?.toJSON();
        const formatted = place.formatted_address ?? "";

        if (loc) {
          _map.panTo(loc);
          setMarkerPosition(which, loc);
          const next = { coord: loc, address: formatted };

          if (which === "dep") {
            setDeparture(next);
            emit(next, destination);
          } else {
            setDestination(next);
            emit(departure, next);
          }
        }
      };

      depEl.addEventListener("gmp-placeselect", (e: any) => onPlaceSelect("dep", e));
      desEl.addEventListener("gmp-placeselect", (e: any) => onPlaceSelect("des", e));

      // 렌더링 위치: map 컨테이너 위에 input 래퍼를 추가
      const wrapper = document.createElement("div");
      wrapper.className = "grid grid-cols-1 md:grid-cols-2 gap-2 mb-3";
      wrapper.appendChild(depEl);
      wrapper.appendChild(desEl);

      // 상단에 인풋, 아래에 지도 DOM
      const host = mapRef.current!.parentElement!;
      host.insertBefore(wrapper, mapRef.current!);

      depPickerRef.current = depEl;
      desPickerRef.current = desEl;

      // 초기 주소 값 반영(있다면)
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
