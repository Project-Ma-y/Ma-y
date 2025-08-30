// src/components/maps/NaverMapPicker.tsx
import { useEffect, useRef, useState } from "react";
import { loadNaverMap } from "@/utils/loadNaverMap";

type Coord = { lat: number; lng: number };
type Place = {
  coord: Coord | null;
  address: string;
};

interface NaverMapPickerProps {
  initialDeparture?: Place;
  initialDestination?: Place;
  onChange: (data: { departure: Place; destination: Place }) => void;
}

export default function NaverMapPicker({
  initialDeparture,
  initialDestination,
  onChange,
}: NaverMapPickerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<any>(null);
  const depMarkerRef = useRef<any>(null);
  const dstMarkerRef = useRef<any>(null);

  const [selectMode, setSelectMode] = useState<"departure" | "destination">("departure");
  const [departure, setDeparture] = useState<Place>(
    initialDeparture ?? { coord: null, address: "" }
  );
  const [destination, setDestination] = useState<Place>(
    initialDestination ?? { coord: null, address: "" }
  );

  // reverse geocode helper
  const fetchAddress = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      const { naver } = window as any;
      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(lat, lng),
        },
        (status: any, response: any) => {
          if (status !== naver.maps.Service.Status.OK) {
            resolve("");
            return;
          }
          const result = response.v2?.addresses?.[0];
          // 도로명 or 지번 가독성 우선순위
          const addr =
            result?.roadAddress || result?.jibunAddress || result?.englishAddress || "";
          resolve(addr);
        }
      );
    });
  };

  useEffect(() => {
    let detachClick: any;

    (async () => {
      await loadNaverMap();

      const { naver } = window as any;

      // 초기 중심점 (서울 시청 근처)
      const center = initialDeparture?.coord
        ? new naver.maps.LatLng(initialDeparture.coord.lat, initialDeparture.coord.lng)
        : new naver.maps.LatLng(37.5666805, 126.9784147);

      const map = new naver.maps.Map(mapRef.current!, {
        center,
        zoom: 15,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      });
      mapObj.current = map;

      // 기존 값이 있으면 마커 표시
      if (initialDeparture?.coord) {
        depMarkerRef.current = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            initialDeparture.coord.lat,
            initialDeparture.coord.lng
          ),
          map,
          icon: {
            content:
              '<div style="padding:4px 8px;border-radius:12px;background:#2563eb;color:#fff;font-size:12px">출발</div>',
            anchor: new naver.maps.Point(20, 20),
          },
        });
      }
      if (initialDestination?.coord) {
        dstMarkerRef.current = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            initialDestination.coord.lat,
            initialDestination.coord.lng
          ),
          map,
          icon: {
            content:
              '<div style="padding:4px 8px;border-radius:12px;background:#16a34a;color:#fff;font-size:12px">도착</div>',
            anchor: new naver.maps.Point(20, 20),
          },
        });
      }

      // 클릭 시 선택 모드에 따라 마커/주소 설정
      const clickListener = naver.maps.Event.addListener(map, "click", async (e: any) => {
        const lat = e.coord.y;
        const lng = e.coord.x;

        const address = await fetchAddress(lat, lng);

        if (selectMode === "departure") {
          setDeparture({ coord: { lat, lng }, address });
          if (!depMarkerRef.current) {
            depMarkerRef.current = new naver.maps.Marker({
              position: new naver.maps.LatLng(lat, lng),
              map,
              icon: {
                content:
                  '<div style="padding:4px 8px;border-radius:12px;background:#2563eb;color:#fff;font-size:12px">출발</div>',
                anchor: new naver.maps.Point(20, 20),
              },
            });
          } else {
            depMarkerRef.current.setPosition(new naver.maps.LatLng(lat, lng));
          }
        } else {
          setDestination({ coord: { lat, lng }, address });
          if (!dstMarkerRef.current) {
            dstMarkerRef.current = new naver.maps.Marker({
              position: new naver.maps.LatLng(lat, lng),
              map,
              icon: {
                content:
                  '<div style="padding:4px 8px;border-radius:12px;background:#16a34a;color:#fff;font-size:12px">도착</div>',
                anchor: new naver.maps.Point(20, 20),
              },
            });
          } else {
            dstMarkerRef.current.setPosition(new naver.maps.LatLng(lat, lng));
          }
        }
      });

      detachClick = () => naver.maps.Event.removeListener(clickListener);
    })();

    return () => {
      if (detachClick) detachClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 상위로 변경 통지
  useEffect(() => {
    onChange({ departure, destination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departure, destination]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[60vh] bg-gray-200 rounded-t-xl" />

      {/* 오버레이 패널 */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="bg-white border-t rounded-t-xl shadow-lg">
            {/* 선택 모드 토글 */}
            <div className="p-3 flex gap-2">
              <button
                className={`px-3 py-2 rounded-xl text-sm border ${
                  selectMode === "departure"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setSelectMode("departure")}
              >
                출발지 선택
              </button>
              <button
                className={`px-3 py-2 rounded-xl text-sm border ${
                  selectMode === "destination"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setSelectMode("destination")}
              >
                도착지 선택
              </button>
            </div>

            {/* 주소 표시 */}
            <div className="px-4 pb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block w-14 shrink-0 text-gray-500">출발지</span>
                  <span className="font-medium text-gray-800 break-all">
                    {departure.address || "지도를 클릭하여 선택"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block w-14 shrink-0 text-gray-500">도착지</span>
                  <span className="font-medium text-gray-800 break-all">
                    {destination.address || "지도를 클릭하여 선택"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
