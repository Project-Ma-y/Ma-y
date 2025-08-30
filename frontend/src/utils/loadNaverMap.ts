// src/utils/loadNaverMap.ts
export function loadNaverMap(): Promise<void> {
  const EXISTING = document.getElementById("naver-map-sdk") as HTMLScriptElement | null;
  if (EXISTING && (window as any).naver?.maps) return Promise.resolve();

  const clientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID as string;
  if (!clientId) {
    return Promise.reject(
      new Error("VITE_NAVER_MAPS_CLIENT_ID 가 .env 에 설정되어 있지 않습니다.")
    );
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = "naver-map-sdk";
    s.async = true;
    // v3 SDK + geocoder
    s.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Naver Maps SDK 로드 실패"));
    document.head.appendChild(s);
  });
}
