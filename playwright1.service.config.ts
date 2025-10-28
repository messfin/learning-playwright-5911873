import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Directory where Playwright will look for tests
  testDir: "./tests/bagel-shop",

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in the code
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI
  retries: process.env.CI ? 1 : 0,

  // Use multiple workers (overridden by CLI flag if needed)
  workers: process.env.CI ? 5 : 20,

  // Reporter options
  reporter: [["list"], ["html", { open: "never" }]],

  // Connect to Microsoft Playwright Cloud
  use: {
    baseURL: "https://your-app-under-test.com", // optional
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // Use the cloud connection from your env var
    connectOptions: {
      wsEndpoint: process.env.PLAYWRIGHT_SERVICE_URL,
    },
  },

  // Optionally define projects for browsers
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "WebKit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
