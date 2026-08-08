import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        en: resolve(import.meta.dirname, "en/index.html"),
        villas: resolve(import.meta.dirname, "villas/index.html"),
        enVillas: resolve(import.meta.dirname, "en/villas/index.html"),
        location: resolve(import.meta.dirname, "location/index.html"),
        enLocation: resolve(import.meta.dirname, "en/location/index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        enPrivacy: resolve(import.meta.dirname, "en/privacy/index.html"),
      },
    },
  },
});
