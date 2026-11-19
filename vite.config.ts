import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  server: {
    // PHP local: php -S 127.0.0.1:8090 -t server
    proxy: { '/collect.php': 'http://127.0.0.1:8090' },
  },
})
