import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import svgLoader from "vite-svg-loader";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    svgLoader(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        type: "module",
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
