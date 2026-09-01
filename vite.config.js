import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: '/',
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    open: '/',
  },
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
