import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      manifest: {
        name: "Tripsit",
        short_name: "Tripsit",
        description: "An AI chatbot for psychedelic users",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#540005",
        orientation: "portrait",
        scope: "/",
      },
      registerType: "autoUpdate",
      injectRegister: "inline",
      base: "/",
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
