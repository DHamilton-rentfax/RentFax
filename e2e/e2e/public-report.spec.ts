import { test, expect } from '@playwright/test';

test('Public renter report loads with sanitized data', async ({ page }) => {
  await page.goto('/report/TEST_RENTER_1');

  await expect(page.locator('text=Incident History')).toBeVisible();
  await expect(page.locator('text=Unauthorized Driver')).not.toContainText(['name', 'phone', 'license']);

  // no internal notes should appear
  expect(await page.content()).not.toContain('internalOnly');
});
