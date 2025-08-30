// src/types/naver-maps.d.ts
declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
  }
}
export {};
