import { defineConfig } from '@playwright/test';

const baseURL = process.env.RENODIA_TEST_URL ?? 'http://127.0.0.1:3000';
export default defineConfig({
  testDir: './tests',
  timeout: 35_000,
  expect: { timeout: 7_000 },
  workers: 2,
  use: {
    baseURL,
    actionTimeout: 10_000,
    viewport: { width: 1440, height: 900 },
    channel: process.env.RENODIA_TEST_CHROME ? 'chrome' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: process.env.RENODIA_TEST_URL ? undefined : {
    command: 'npm run dev -- --hostname 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});
