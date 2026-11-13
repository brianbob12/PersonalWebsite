import { defineConfig } from "@playwright/test";
import smoke from "./playwright.config";

// This configuration is used only by the explicit test:compat command.
export default defineConfig({
  ...smoke,
  testMatch: "**/*.spec.ts",
  projects: [
    {
      name: "chromium",
      testIgnore: "**/touch.compat.spec.ts",
      use: {
        browserName: "chromium",
        channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
      },
    },
    {
      name: "firefox",
      testIgnore: "**/touch.compat.spec.ts",
      use: { browserName: "firefox" },
    },
    {
      name: "webkit",
      testIgnore: "**/touch.compat.spec.ts",
      use: { browserName: "webkit" },
    },
    {
      name: "webkit-iphone",
      testMatch: ["**/touch.compat.spec.ts", "**/pulse.compat.spec.ts"],
      use: {
        browserName: "webkit",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    },
    {
      name: "webkit-ipad",
      testMatch: ["**/touch.compat.spec.ts", "**/pulse.compat.spec.ts"],
      use: {
        browserName: "webkit",
        viewport: { width: 1366, height: 1024 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    },
  ],
});
