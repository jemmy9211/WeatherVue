import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/TWeather/',
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'TWeather',
        short_name: 'TWeather',
        description: 'TWeather made by vue'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})


