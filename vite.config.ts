import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  server: {
    port: 5173,
    host: true,
  },
  css: {
    devSourcemap: true,
  },
  assetsInclude: ["**/*.css"],
});
