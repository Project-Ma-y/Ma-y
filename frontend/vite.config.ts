import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import lightningcss from 'vite-plugin-lightningcss';
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    lightningcss(), 
  ],
  server: {
    proxy: {
      // 프론트:  /api/users/family  →  백엔드: https://ma-y-5usy.onrender.com/api/users/family
      "/api": {
        target: "https://ma-y-5usy.onrender.com", // ← '/api' 붙이지 말기!
        changeOrigin: true,
        secure: true,
        // rewrite X (원본 경로 그대로 보냄)
      },
    },
  },
   resolve: {
    alias: {
       "@": fileURLToPath(new URL("./src", import.meta.url)), // ✅ '@/...' -> src
    },
  },
  
})
