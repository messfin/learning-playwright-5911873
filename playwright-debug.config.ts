import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30_000,
  globalTimeout: 10 * 60 * 1000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "https://practicesoftwaretesting.com",
    testIdAttribute: "data-test",
    trace: "on",
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read"] },
    },
  ],
});
