import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss(), solid(), solidSvg()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
