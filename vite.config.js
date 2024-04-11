import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        secure: false,
        changeOrigin: true,
        // target: 'https://mock.mengxuegu.com/mock/63f461cfc5a76a117cab125b/vue3Admin',
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
        // target: 'http://101.201.117.246',
        target: 'http://172.17.30.201',
        // rewrite: (path) => path.replace(/^\/api/, '/')
      },
    },
  },
});
