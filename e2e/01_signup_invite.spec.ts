import { test, expect } from '@playwright/test';

// 👋 Smoke Test: Application Health Check
// This runs first to ensure the application is responsive before other tests.
test.describe('Application Health Check', () => {
  test('should load the homepage and display the main heading', async ({ page }) => {
    // 1. Visit the root URL of the web server
    await page.goto('/');

    // 2. Find a stable, key element. The main heading is a great choice.
    //    We use a regular expression to make the text matching case-insensitive.
    const mainHeading = page.locator('h1', { hasText: /RentFAX/i });

    // 3. Assert that this element is visible on the page.
    //    We give it a generous timeout because it might be the very first page load.
    await expect(mainHeading).toBeVisible({ timeout: 15000 });
  });
});

test.describe('User Onboarding', () => {
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
});
