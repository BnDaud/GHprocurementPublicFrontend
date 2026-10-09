import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // local viewing only: read the site's public content (catalog, FAQ, posts)
    // from the live API so the page is not empty. Nothing is written there.
    proxy: {
      "/livedata": {
        target: "https://ghprocurement-jne6.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/livedata/, "/api"),
      },
    },
  },
});
