// src/lib/loadNaverMap.ts
type NaverMapGlobal = typeof window & {
  naver?: any;
  navermap_authFailure?: () => void;
};

declare const window: NaverMapGlobal;

let loadingPromise: Promise<typeof window.naver> | null = null;

function pickClientIdByHost(): string | undefined {
  const host = location.hostname;
  const env = import.meta.env;

  // 필요시 케이스 추가
  if (host.endsWith("netlify.app")) return env.VITE_NAVER_MAP_CLIENT_ID_NETLIFY || env.VITE_NAVER_MAP_CLIENT_ID;
  if (host === "mayservice.co.kr" || host === "www.mayservice.co.kr")
    return env.VITE_NAVER_MAP_CLIENT_ID_PROD || env.VITE_NAVER_MAP_CLIENT_ID;

  // 로컬/기타
  return env.VITE_NAVER_MAP_CLIENT_ID;
}

export function loadNaverMapsV3(): Promise<typeof window.naver> {
  if (window.naver?.maps) {
    return Promise.resolve(window.naver);
  }
  if (loadingPromise) return loadingPromise;

  const clientId = pickClientIdByHost();
  if (!clientId) {
    return Promise.reject(new Error("[NaverMap] Missing clientId. Check VITE_NAVER_MAP_CLIENT_ID* envs."));
  }

  const src = new URL("https://oapi.map.naver.com/openapi/v3/maps.js");
  // 최신 v3 가이드 기준: ncpClientId, submodules 지정
  src.searchParams.set("ncpClientId", clientId);
  src.searchParams.set("submodules", "geocoder"); // 필요시 'drawing','visualization' 등 추가
  // 로더 콜백은 사용하지 않고, onload/onerror/전역 authFailure 로 제어

  loadingPromise = new Promise((resolve, reject) => {
    // 인증 실패 훅
    window.navermap_authFailure = () => {
      reject(
        new Error(
          `[NaverMap] Authentication Failed (authFailure). clientId=${clientId}, origin=${location.origin}, path=${location.pathname}`
        )
      );
    };

    const script = document.createElement("script");
    script.src = src.toString();
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      // 간헐적으로 onload 직후 maps 네임스페이스가 늦게 붙는 케이스를 한 번 더 확인
      const ready = () => {
        if (window.naver?.maps) {
          // 서브모듈 로드 확인: geocoder 존재여부
          // console.debug("[NaverMap] loaded. Service available:", Object.keys(window.naver.maps?.Service ?? {}));
          resolve(window.naver);
        } else {
          // 다음 프레임에서 재확인
          requestAnimationFrame(ready);
        }
      };
      ready();
    };

    script.onerror = () => {
      reject(new Error("[NaverMap] Failed to load maps.js (network/CSP)"));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}
