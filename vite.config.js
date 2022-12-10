import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: [
      "chrome67",
      "edge79",
      "safari24",
      "firefox68",
      "opera54",
      "ios14",
      "es2020",
    ],
  },
});
