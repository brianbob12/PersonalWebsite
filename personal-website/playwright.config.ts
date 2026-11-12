import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
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
      testMatch: "**/touch.compat.spec.ts",
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
      testMatch: "**/touch.compat.spec.ts",
      use: {
        browserName: "webkit",
        viewport: { width: 1366, height: 1024 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: "yarn preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
