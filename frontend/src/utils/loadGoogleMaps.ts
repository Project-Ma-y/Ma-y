// src/utils/loadGoogleMaps.ts
type LoadOpts = {
  libraries?: string[];     // e.g. ["places","geocoding"]
  language?: string;        // e.g. "ko"
  region?: string;          // e.g. "KR"
  timeoutMs?: number;       // default 10_000
};

declare global {
  interface Window {
    google?: any;
    __googleMapsReady__?: () => void;
  }
}

const SDK_ID = "google-maps-sdk";

export function loadGoogleMaps(opts: LoadOpts = {}): Promise<void> {
  if (window.google?.maps) return Promise.resolve();

  // 기존 태그/콜백 정리
  document.querySelectorAll<HTMLScriptElement>(`#${SDK_ID}`).forEach((el) => el.remove());
  try { delete (window as any).__googleMapsReady__; } catch {}

  const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    return Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY 누락"));
  }

  const envLibs =
    (import.meta.env as any).VITE_GOOGLE_MAPS_LIBS ??
    (opts.libraries?.join(",") ?? "places");
  const language = opts.language ?? "ko";
  const region = opts.region ?? "KR";

  return new Promise<void>((resolve, reject) => {
    let done = false;
    const finish = (ok: boolean, err?: any) => {
      if (done) return;
      done = true;
      try { delete (window as any).__googleMapsReady__; } catch {}
      ok ? resolve() : reject(err ?? new Error("Google Maps SDK 로드 실패"));
    };

    // v=weekly 권장, callback으로 ready 보장
    const qs = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      libraries: envLibs,
      callback: "__googleMapsReady__",
      language,
      region,
    }).toString();

    (window as any).__googleMapsReady__ = () => {
      // Safari 등에서 late-attach 대비 폴링
      let tries = 0;
      const tick = () => {
        const ok = !!window.google?.maps;
        if (ok) finish(true);
        else if (tries++ < 40) setTimeout(tick, 50);
        else finish(false, new Error("콜백은 왔으나 google.maps 미탑재"));
      };
      tick();
    };

    const s = document.createElement("script");
    s.id = SDK_ID;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?${qs}`;
    s.onerror = () => finish(false, new Error("Google Maps SDK 네트워크 오류"));
    document.head.appendChild(s);

    // 타임아웃
    const to = setTimeout(() => finish(false, new Error("Google Maps SDK 로드 타임아웃")), opts.timeoutMs ?? 10_000);
    const _finish = finish;
    (finish as any) = (...args: any[]) => { clearTimeout(to); _finish(...args); };
  });
}
