import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { viteMockServe } from "vite-plugin-mock";
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  const isBuild = command === "build";
  return {
    plugins: [
      react(),
      env.VITE_USE_MOCK === "true"
        ? viteMockServe({
            ignore: /^_/,
            mockPath: "mock",
            localEnabled: !isBuild,
            prodEnabled: isBuild,
            injectCode: `
        import { setupProdMockServer } from '../mock/mockProdServe'
  
        setupProdMockServer()
        `
          })
        : undefined
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    css: {
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCaseOnly"
      }
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          secure: false,
          changeOrigin: true,
          // target: 'https://mock.mengxuegu.com/mock/63f461cfc5a76a117cab125b/vue3Admin',
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
          // target: 'http://101.201.117.246',
          target: "http://172.17.30.201"
          // rewrite: (path) => path.replace(/^\/api/, '/')
        }
      }
    }
  };
});
