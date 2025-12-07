import { test, expect } from '@playwright/test';

test('Company must unlock report before viewing', async ({ page }) => {
  await page.goto('/portal/search');
  await page.fill('[data-test="search-input"]', 'John Test');
  await page.click('[data-test="search-btn"]');

  await page.click('[data-test="view-report"]');

  await expect(page.locator('[data-test="locked-status"]')).toBeVisible();

  await page.click('[data-test="purchase-report"]');
  await expect(page.locator('[data-test="unlocked-status"]')).toBeVisible();
});
