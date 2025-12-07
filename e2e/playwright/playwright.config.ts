
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  fullyParallel: true,
  use: { baseURL: process.env.BASE_URL || 'https://rentfax-staging.web.app', headless: true },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile', use: { ...devices['Pixel 7'] } },
  ],
})
