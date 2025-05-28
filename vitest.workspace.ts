import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      name: "browser",
      include: ["src/**/*.browser.test.tsx"],
      browser: {
        enabled: true,
        provider: "playwright",
        instances: [{ browser: "firefox" }],
      },
    },
  },
  {
    test: {
      name: "unit",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  },
]);
