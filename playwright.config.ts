// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: 'e2e-report' }]],
  globalSetup: require.resolve('./e2e/config/globalSetup'),
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:9002',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'firebase emulators:start',
    port: 9002,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
});
