import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIdAttribute: 'data-test',
  baseURL: 'https://practicesoftwaretesting.com',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [['html', { outputFile: 'playwright-report/index.html' }]],
  use: {
    trace: 'on',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: '.auth/customer01.json',
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});