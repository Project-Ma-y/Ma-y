// src/utils/loadNaverMap.ts
export function loadNaverMap(): Promise<void> {
  const existing = document.getElementById("naver-map-sdk") as HTMLScriptElement | null;
  if (existing && (window as any).naver?.maps) return Promise.resolve();

  const keyId = import.meta.env.VITE_NAVER_MAPS_KEY_ID as string;
  if (!keyId) return Promise.reject(new Error("VITE_NAVER_MAPS_KEY_ID 누락"));

  return new Promise<void>((resolve, reject) => {
    (window as any).navermap_authFailure = function () {
      console.error("NAVER Maps 인증 실패 (도메인/URL/키 확인)");
    };
    (window as any).__naverReady__ = () => resolve();

    const s = document.createElement("script");
    s.id = "naver-map-sdk";
    s.async = true;
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${keyId}&submodules=geocoder&callback=__naverReady__`;
    s.onerror = () => reject(new Error("Naver Maps SDK 로드 실패"));
    document.head.appendChild(s);
  });
}
