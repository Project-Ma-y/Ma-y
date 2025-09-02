// src/components/map/GoogleMap.tsx
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

type Props = {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onReady?: (map: google.maps.Map) => void;
  className?: string;
};

export default function GoogleMap({ center = { lat: 37.5665, lng: 126.9780 }, zoom = 14, onReady, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      await loadGoogleMaps();
      const map = new google.maps.Map(ref.current!, { center, zoom, mapId: undefined });
      onReady?.(map);
    })();
  }, [center.lat, center.lng, zoom]);

  return <div ref={ref} className={className ?? "h-72 w-full rounded-xl"} />;
}
