// src/pages/reservation/Step3_Location.tsx
import React, { useMemo, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
// ✅ 네이버 → 구글로 교체
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

  const isValid = useMemo(
    () => Boolean(departure.address && destination.address),
    [departure.address, destination.address]
  );

  const handleNextClick = () => {
    if (!isValid) return;
    onNext({
      departureAddress: departure.address,
      destinationAddress: destination.address,
      departureCoord: departure.coord,
      destinationCoord: destination.coord,
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
      />

      <Card className="absolute bottom-0 w-full rounded-b-none p-0 pointer-events-none bg-transparent shadow-none">
        <div className="pointer-events-auto p-4">
          <h2 className="text-xl font-bold mb-3">선택된 경로</h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex gap-2">
              <span className="text-gray-500 shrink-0">출발지</span>
              <span className="font-medium break-all">{departure.address || "-"}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500 shrink-0">도착지</span>
              <span className="font-medium break-all">{destination.address || "-"}</span>
            </li>
          </ul>
        </div>
        <div className="pointer-events-auto flex justify-between gap-2 p-4 bg-gray-50 border-t">
          <Button onClick={onPrev} buttonName="이전" type="secondary" />
          <Button onClick={handleNextClick} buttonName="다음" type="primary" disabled={!isValid} />
        </div>
      </Card>
    </div>
  );
};

export default Step3_Location;
