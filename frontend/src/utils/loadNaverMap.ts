// src/utils/loadNaverMap.ts
export async function loadNaverMap(): Promise<void> {
  const EXISTING = document.getElementById("naver-map-sdk") as HTMLScriptElement | null;
  if (EXISTING && (window as any).naver?.maps) return;

  const keyId = import.meta.env.VITE_NAVER_MAPS_KEY_ID as string;
  if (!keyId) throw new Error("VITE_NAVER_MAPS_KEY_ID 가 .env 에 없습니다.");

  // 인증 실패 콜백(신규 가이드)
  (window as any).navermap_authFailure = function () {
    console.error("NAVER Maps 인증 실패: 도메인/URL 또는 ncpKeyId 확인");
  };

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.id = "naver-map-sdk";
    s.async = true;
    // ✅ 신규 엔드포인트 & 파라미터 (oapi + ncpKeyId)
    //    geocoder 모듈 사용하므로 submodules=geocoder 포함
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${keyId}&submodules=geocoder`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Naver Maps SDK 로드 실패"));
    document.head.appendChild(s);
  });
}
