import { test, expect } from '@playwright/test';

test('owner signup -> create company -> invite teammate flow', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[type="email"]', `owner+${Date.now()}@example.com`);
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button:has-text("Sign Up")');

  await page.waitForURL('**/setup/company');
  await page.fill('input[id="company-name"]', 'E2E Rentals');
  await page.click('button:has-text("Create & Continue")');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  await page.goto('/settings/team');
  await page.fill('input[id="email"]', `agent+${Date.now()}@example.com`);
  await page.locator('#role').click();
  await page.locator('[data-radix-collection-item]:has-text("agent")').click();
  await page.click('button:has-text("Send Invite")');

  const inviteLinkInput = page.locator('input[readonly]');
  await expect(inviteLinkInput).toBeVisible();
  const inviteLink = await inviteLinkInput.inputValue();
  expect(inviteLink).toContain('/invite/');
});
