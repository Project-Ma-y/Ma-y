// src/components/map/GoogleMapPicker.tsx
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import clsx from "clsx";

export type LatLng = { lat: number; lng: number };

type Props = {
  value?: LatLng;
  onChange?: (next: { latlng: LatLng; address?: string }) => void;
  defaultCenter?: LatLng;
  className?: string;
  inputClassName?: string;
};

export default function GoogleMapPicker({
  value,
  onChange,
  defaultCenter = { lat: 37.5665, lng: 126.9780 },
  className,
  inputClassName,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [latlng, setLatlng] = useState<LatLng>(value ?? defaultCenter);
  const [address, setAddress] = useState<string>("");

  // 초기 로드
  useEffect(() => {
    (async () => {
      await loadGoogleMaps({ libraries: ["places", "marker", "geocoding"] });

      // 맵
      const _map = new google.maps.Map(mapRef.current!, {
        center: value ?? defaultCenter,
        zoom: 15,
        // mapId: "YOUR_MAP_ID", // 맞춤지도 사용 시
      });
      setMap(_map);

      // 마커 (AdvancedMarker가 있으면 우선 사용)
      const hasAdv = (google.maps as any).marker?.AdvancedMarkerElement;
      markerRef.current = hasAdv
        ? new (google.maps as any).marker.AdvancedMarkerElement({
            map: _map,
            position: value ?? defaultCenter,
          })
        : new google.maps.Marker({
            map: _map,
            position: value ?? defaultCenter,
          });

      // 지오코더
      geocoderRef.current = new google.maps.Geocoder();

      // 클릭으로 선택
      _map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const pos = e.latLng.toJSON();
        updatePosition(pos, true);
      });

      // 입력창 자동완성
      if (inputRef.current) {
        const ac = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: ["kr"] },
        });
        ac.addListener("place_changed", () => {
          const p = ac.getPlace();
          const loc = p.geometry?.location?.toJSON();
          if (loc) {
            _map.panTo(loc);
            updatePosition(loc, false, p.formatted_address);
          }
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부 value 갱신 반영
  useEffect(() => {
    if (!map || !value) return;
    map.panTo(value);
    if (markerRef.current instanceof google.maps.Marker) {
      markerRef.current.setPosition(value);
    } else if ((google.maps as any).marker?.AdvancedMarkerElement && markerRef.current) {
      (markerRef.current as any).position = value;
    }
    setLatlng(value);
  }, [value?.lat, value?.lng, map]);

  const updatePosition = (pos: LatLng, doReverse: boolean, addrOverride?: string) => {
    if (markerRef.current instanceof google.maps.Marker) {
      markerRef.current.setPosition(pos);
    } else if ((google.maps as any).marker?.AdvancedMarkerElement && markerRef.current) {
      (markerRef.current as any).position = pos;
    }
    setLatlng(pos);

    if (addrOverride) {
      setAddress(addrOverride);
      onChange?.({ latlng: pos, address: addrOverride });
      return;
    }

    if (doReverse && geocoderRef.current) {
      geocoderRef.current.geocode({ location: pos }, (res, status) => {
        if (status === "OK" && res && res[0]) {
          const addr = res[0].formatted_address ?? "";
          setAddress(addr);
          onChange?.({ latlng: pos, address: addr });
        } else {
          onChange?.({ latlng: pos });
        }
      });
    } else {
      onChange?.({ latlng: pos });
    }
  };

  return (
    <div className={clsx("space-y-2", className)}>
      <input
        ref={inputRef}
        placeholder="주소로 검색 (예: 서울특별시청)"
        className={clsx(
          "w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2",
          inputClassName
        )}
      />
      <div ref={mapRef} className="h-72 w-full rounded-xl" />
      <div className="text-sm text-gray-600">
        현재 좌표: {latlng.lat.toFixed(6)}, {latlng.lng.toFixed(6)} {address && <>/ {address}</>}
      </div>
    </div>
  );
}
