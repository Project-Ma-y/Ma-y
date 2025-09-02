// src/types/google.maps.d.ts
export {};
declare global {
  interface Window {
    google?: typeof google;
    __googleMapsReady__?: () => void;
  }
  // 필요한 경우 확장 타입 추가 가능
}
