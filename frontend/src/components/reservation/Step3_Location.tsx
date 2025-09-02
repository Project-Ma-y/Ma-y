// src/pages/reservation/Step3_Location.tsx
import React, { useMemo, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import GoogleRoutePicker from "@/components/maps/GoogleRoutePicker";

interface Step3Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

type Place = { coord: { lat: number; lng: number } | null; address: string };

const Step3_Location: React.FC<Step3Props> = ({ formData, onNext, onPrev }) => {
  const [departure, setDeparture] = useState<Place>({
    coord: null,
    address: formData?.departureAddress || "",
  });
  const [destination, setDestination] = useState<Place>({
    coord: null,
    address: formData?.destinationAddress || "",
  });
  const [departureDetail, setDepartureDetail] = useState<string>(
    formData?.departureDetail || ""
  );
  const [destinationDetail, setDestinationDetail] = useState<string>(
    formData?.destinationDetail || ""
  );

  const isValid = useMemo(
    () => Boolean(departure.address && destination.address),
    [departure.address, destination.address]
  );

  const handleNextClick = () => {
    if (!isValid) return;

    const depFull = `${departure.address}${departureDetail ? ` ${departureDetail}` : ""}`;
    const desFull = `${destination.address}${destinationDetail ? ` ${destinationDetail}` : ""}`;

    onNext({
      departureAddress: depFull,
      destinationAddress: desFull,
      departureCoord: departure.coord,
      destinationCoord: destination.coord,
      departureDetail,
      destinationDetail,
    });
  };

  return (
    <div className="relative">
      <GoogleRoutePicker
        initialDeparture={departure}
        initialDestination={destination}
        onChange={({ departure: d, destination: t }) => {
          setDeparture(d);
          setDestination(t);
        }}
        // 메인 레이아웃 안에서 지도 영역을 크게
        mapClassName="h-[40vh] md:h-[45vh]"
      />

      {/* 메인 레이아웃 내부에 고정(sticky) */}
      <div className="sticky bottom-0 z-20 mt-4">
        <Card className="rounded-t-2xl border-t p-0 shadow-xl">
          <div className="p-4 space-y-3">
            <h2 className="text-xl font-bold">선택된 경로</h2>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-gray-500">출발지</span>
                <span className="font-medium break-all">{departure.address || "-"}</span>
                <input
                  value={departureDetail}
                  onChange={(e) => setDepartureDetail(e.target.value)}
                  placeholder="상세주소 (동/호/건물명 등)"
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                />
              </li>

              <li className="flex flex-col gap-1">
                <span className="text-gray-500">도착지</span>
                <span className="font-medium break-all">{destination.address || "-"}</span>
                <input
                  value={destinationDetail}
                  onChange={(e) => setDestinationDetail(e.target.value)}
                  placeholder="상세주소 (동/호/건물명 등)"
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                />
              </li>
            </ul>

            <div className="flex justify-between gap-2 pt-2">
              <Button onClick={onPrev} buttonName="이전" type="secondary" />
              <Button
                onClick={handleNextClick}
                buttonName="다음"
                type="primary"
                disabled={!isValid}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Step3_Location;
