import { test, expect } from '@playwright/test';

test('Admin can create an incident and fraud engine updates renter', async ({ page }) => {
  await page.goto('/dashboard/incidents/new');

  await page.fill('[data-test="renter-id"]', 'TEST_RENTER_1');
  await page.fill('[data-test="incident-type"]', 'vehicle_damage');
  await page.fill('[data-test="cost"]', '1200');
  await page.click('[data-test="submit-incident"]');

  // confirm success
  await expect(page.locator('[data-test="success-toast"]')).toBeVisible();

  // renter risk score should update
  await page.goto('/dashboard/renters/TEST_RENTER_1');
  const risk = await page.locator('[data-test="risk-score"]').innerText();
  expect(Number(risk)).toBeGreaterThan(1);
});
