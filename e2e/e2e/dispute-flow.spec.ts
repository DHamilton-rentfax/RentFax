import { test, expect } from '@playwright/test';

test('Renter can submit a dispute and admin sees alert', async ({ page }) => {
  await page.goto('/renter/incidents');
  await page.click('[data-test="open-dispute"]');
  await page.fill('[data-test="dispute-message"]', 'This is incorrect.');
  await page.click('[data-test="submit-dispute"]');

  await expect(page.locator('[data-test="success-toast"]')).toBeVisible();

  // admin sees dispute alert
  await page.goto('/dashboard/disputes');
  await expect(page.locator('text=This is incorrect')).toBeVisible();
});
