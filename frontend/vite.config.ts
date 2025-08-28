import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import lightningcss from 'vite-plugin-lightningcss';

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    lightningcss(), 
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://ma-y.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
   resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
})
