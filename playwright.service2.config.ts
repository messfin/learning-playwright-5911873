import { defineConfig, devices, chromium } from "@playwright/test";

const wsEndpoint = process.env.PLAYWRIGHT_WS_ENDPOINT;

export default defineConfig({
  use: wsEndpoint
    ? {
        // Connect to remote Playwright browser
        browserName: "chromium",
        connectOptions: { wsEndpoint },
      }
    : {
        // Fallback to local browser if WS endpoint not set
        browserName: "chromium",
        headless: false,
      },
});
