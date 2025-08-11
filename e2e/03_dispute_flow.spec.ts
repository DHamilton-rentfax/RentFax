import { test, expect } from '@playwright/test';

// Note: This test is a stub. A true E2E test for this flow would be complex:
// 1. Create a renter, rental, and incident (as company).
// 2. Log in AS THE RENTER.
// 3. The renter starts a dispute on that incident.
// 4. Log in AS THE COMPANY.
// 5. Respond to the dispute.
// This requires multi-user login which is advanced. This test simulates the company-side only.

test.describe('Dispute Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
    await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('company can view disputes and change status', async ({ page }) => {
    // This assumes at least one dispute exists for the test company.
    // A more robust test would create one first via API or UI.
    await page.goto('/disputes');
    
    // Wait for disputes to load
    await expect(page.locator('table')).toBeVisible();
    const firstDisputeLink = page.locator('table > tbody > tr:first-child > td:first-child > a').first();
    
    // If no disputes, we can't test the detail page.
    const count = await firstDisputeLink.count();
    if (count === 0) {
      console.log('Skipping dispute detail test: No disputes found for test user.');
      return;
    }

    await firstDisputeLink.click();
    await page.waitForURL('**/disputes/**');

    // Change status
    await page.locator('button[role="combobox"]').click();
    await page.locator('[data-radix-collection-item]:has-text("Needs Info")').click();
    
    // Check for success toast and that the status badge updated
    await expect(page.locator('text=Dispute status updated')).toBeVisible();
    await expect(page.locator('div[data-state="closed"]:has-text("Needs Info")')).toBeVisible();
  });
});
