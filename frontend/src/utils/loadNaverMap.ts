// src/utils/loadNaverMap.ts
export function loadNaverMap(opts?: { submodules?: string[] }): Promise<void> {
  // 이미 로드돼 있으면 바로 종료
  if ((window as any).naver?.maps) return Promise.resolve();

  // 기존 스크립트 태그가 있는데 maps가 없는 경우 안전 제거 후 재시도
  const existing = document.getElementById("naver-map-sdk") as HTMLScriptElement | null;
  if (existing && !(window as any).naver?.maps) {
    try { existing.parentElement?.removeChild(existing); } catch {}
  }

  // 키: clientId/ keyId 둘 다 지원 (환경에 따라 명칭 다름)
  const clientId =
    (import.meta.env as any).VITE_NAVER_MAPS_CLIENT_ID ||
    (import.meta.env as any).VITE_NAVER_MAPS_KEY_ID;

  if (!clientId) {
    return Promise.reject(new Error("네이버 지도 키 누락: VITE_NAVER_MAPS_CLIENT_ID 또는 VITE_NAVER_MAPS_KEY_ID"));
  }

  // 서브모듈: 기본 geocoder. 필요시 .env 로 재정의 가능
  const envSub =
    (import.meta.env as any).VITE_NAVER_MAPS_SUBMODULES ||
    (opts?.submodules?.join(",") ?? "geocoder");

  return new Promise<void>((resolve, reject) => {
    // 인증 실패 훅
    (window as any).navermap_authFailure = function () {
      console.error("[NaverMap] 인증 실패 (도메인/URL/키 확인)");
    };

    // ready 콜백: naver.maps 객체가 실제 준비됐는지 추가 확인
    (window as any).__naverReady__ = () => {
      // 일부 환경에서 callback이 먼저 불리고 maps가 늦게 붙는 경우가 있어 폴링 한 번 더
      let tries = 0;
      const tick = () => {
        const ok = !!(window as any).naver?.maps;
        if (ok) {
          // 서비스 기능 가용성 로그 (지오코딩/검색 함수 탐지)
          const svc = (window as any).naver?.maps?.Service;
          const available = ["geocode", "reverseGeocode", "search", "placeSearch", "searchPoi"]
            .filter((k) => typeof (svc as any)?.[k] === "function");
          // 디버그: 어떤 함수가 있는지 확인용
          // eslint-disable-next-line no-console
          console.log("[NaverMap] loaded. Service available:", available);
          resolve();
        } else if (tries++ < 20) {
          setTimeout(tick, 50);
        } else {
          reject(new Error("Naver Maps SDK 로드 완료 콜백은 왔지만 naver.maps 가 준비되지 않았습니다."));
        }
      };
      tick();
    };

    // 스크립트 삽입
    const s = document.createElement("script");
    s.id = "naver-map-sdk";
    s.async = true;

    // 공식 문서에 따라 clientId 파라미터 명이 다른 케이스가 있어 둘 다 시도
    // ncpClientId 우선, 일부 프로젝트는 ncpKeyId를 사용
    const qsA = new URLSearchParams({
      ncpClientId: String(clientId),
      submodules: envSub,
      callback: "__naverReady__",
    }).toString();

    const qsB = new URLSearchParams({
      ncpKeyId: String(clientId),
      submodules: envSub,
      callback: "__naverReady__",
    }).toString();

    // 먼저 A를 시도, 실패 시 onerror에서 B를 재시도
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${qsA}`;
    s.onerror = () => {
      // 첫 시도가 실패하면 key 파라미터 명만 바꿔 한 번 더
      const s2 = document.createElement("script");
      s2.id = "naver-map-sdk";
      s2.async = true;
      s2.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${qsB}`;
      s2.onerror = () => reject(new Error("Naver Maps SDK 로드 실패"));
      document.head.appendChild(s2);
    };

    document.head.appendChild(s);
  });
}
