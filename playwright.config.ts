import { defineConfig, devices } from "@playwright/test";
//import { getServiceConfig } from "@azure/microsoft-playwright-testing";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

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
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read"] },
    },
    {
      name: "chromium-no-setup",
      testMatch: /fus-10.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
