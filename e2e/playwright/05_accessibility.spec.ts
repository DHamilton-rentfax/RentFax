
import { test, expect, chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home page meets a11y standards', async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://rentfax-staging.web.app')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
  await browser.close()
})
