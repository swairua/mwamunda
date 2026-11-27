import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        __dirname,
        path.join(__dirname, "client"),
        path.join(__dirname, "shared"),
      ],
    },
    proxy: {
      "/api.php": {
        target: "http://localhost:8000",
        // Keep the browser's Host header so the API sees these requests as
        // same-origin (it compares Origin with Host).
        changeOrigin: false,
      },
    },
    middlewareMode: false,
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  // The server bundle is only used by the build-time prerender; bundling its
  // dependencies avoids CommonJS/ESM import problems in Node.
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
