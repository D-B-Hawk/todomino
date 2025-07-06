import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid(), solidSvg()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
