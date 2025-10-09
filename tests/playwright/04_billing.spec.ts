
import { test, expect } from '@playwright/test'

test('billing portal opens', async ({ page }) => {
  // This test assumes the user is logged in and has access to the billing page.
  await page.goto('/billing/history')
  await page.click('text=Manage Subscription')
  
  // Since this opens a new tab to Stripe, we listen for the 'popup' event.
  const popup = await page.waitForEvent('popup');
  
  // Wait for the popup to load and assert that its URL is the Stripe billing portal.
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/billing\.stripe\.com/)
})
