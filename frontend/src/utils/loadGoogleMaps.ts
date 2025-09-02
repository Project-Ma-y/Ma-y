// src/utils/loadGoogleMaps.ts
type LoadOpts = {
  libraries?: string[];     // ["places","geocoding","marker"]
  language?: string;        // "ko"
  region?: string;          // "KR"
  timeoutMs?: number;       // default 10000
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

  // clean
  document.querySelectorAll<HTMLScriptElement>(`#${SDK_ID}`).forEach(el => el.remove());
  try { delete (window as any).__googleMapsReady__; } catch {}

  const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    console.warn("[GoogleMaps] VITE_GOOGLE_MAPS_API_KEY is missing");
    return Promise.reject(new Error("Missing Google Maps API key"));
  }

  const envLibs = (import.meta.env as any).VITE_GOOGLE_MAPS_LIBS;
  const libraries = envLibs ?? (opts.libraries?.join(",") ?? "places,geocoding");
  const language = opts.language ?? "ko";
  const region = opts.region ?? "KR";

  return new Promise<void>((resolve, reject) => {
    let done = false;
    let timeoutId: number | undefined;

    const finish = (ok: boolean, err?: any) => {
      if (done) return;
      done = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      try { delete (window as any).__googleMapsReady__; } catch {}
      ok ? resolve() : reject(err ?? new Error("Google Maps SDK load failed"));
    };

    (window as any).__googleMapsReady__ = () => {
      // 일부 브라우저 late-attach 대비
      let tries = 0;
      const tick = () => {
        const ok = !!window.google?.maps;
        if (ok) finish(true);
        else if (tries++ < 40) setTimeout(tick, 50);
        else finish(false, new Error("Callback fired but google.maps not ready"));
      };
      tick();
    };

    const qs = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      libraries,            // "a,b,c"
      callback: "__googleMapsReady__",
      language,
      region,
      loading: "async",     // ✅ async 로딩 권고 대응
    }).toString();

    const s = document.createElement("script");
    s.id = SDK_ID;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?${qs}`;
    s.onerror = () => finish(false, new Error("Google Maps SDK network error"));
    document.head.appendChild(s);

    timeoutId = window.setTimeout(() => {
      finish(false, new Error("Google Maps SDK load timeout"));
    }, opts.timeoutMs ?? 10_000);
  });
}
