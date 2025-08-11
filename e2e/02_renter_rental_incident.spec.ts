import { test, expect } from '@playwright/test';

test.describe('Renter, Rental, and Incident Flow', () => {
  // Assume user is logged in for these tests. 
  // In a real scenario, you would use a stored auth state.
  test.beforeEach(async ({ page }) => {
    // This is a simplified login flow. In a real test suite, you'd
    // likely have a global setup file to handle auth once.
    await page.goto('/login');
    // Use credentials for a pre-existing test user
    await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
    await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('create renter -> score is visible', async ({ page }) => {
    await page.goto('/renters');
    await page.click('button:has-text("Add Renter")');
    
    // Fill out the renter form
    await page.fill('input[name="name"]', 'Testy McRent');
    await page.fill('input[name="email"]', `testy-${Date.now()}@example.com`);
    await page.fill('input[name="licenseNumber"]', 'X1234567');
    await page.fill('input[name="licenseState"]', 'CA');
    await page.fill('input[name="dob"]', '1990-01-01');
    
    await page.click('button:has-text("Save Renter")');
    
    // Check for success toast
    await expect(page.locator('text=Renter Created')).toBeVisible();

    // Go back to the renters list and verify the new renter is there
    await page.goto('/renters');
    await expect(page.locator('text=Testy McRent')).toBeVisible();
    // A basic score should be visible. We aren't testing the value, just its presence.
    const riskScoreBadge = page.locator(`//tr[contains(., "Testy McRent")]/td/div[contains(@class, "badge")]`).first();
    await expect(riskScoreBadge).toBeVisible();
  });
});
