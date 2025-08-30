// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // 개발 백엔드 타겟 (없으면 로컬 8000)
  const DEV_API_TARGET = env.VITE_DEV_API_TARGET || "http://localhost:8000";

  return {
    base: "/", // 서브경로 배포 아니면 항상 "/"
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: true, // LAN 테스트 허용
      port: 5173,
      open: false,
      hmr: { overlay: true },
      proxy: {
        // 프론트에서 '/api'로 호출하면 개발 중엔 백엔드로 프록시
        "/api": {
          target: DEV_API_TARGET, // ex) http://localhost:8000  또는  https://<dev-backend>
          changeOrigin: true,
          secure: false, // self-signed HTTPS 허용
          // 백엔드가 /api 프리픽스를 기대한다면 주석 유지
          // 프리픽스가 불필요하면 아래 rewrite 주석 해제
          // rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
    // vite preview로 볼 때도 프록시 동작 원하면 설정
    preview: {
      port: 5173,
      proxy: {
        "/api": {
          target: DEV_API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
