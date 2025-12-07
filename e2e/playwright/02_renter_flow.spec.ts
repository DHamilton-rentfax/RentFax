
import { test, expect } from '@playwright/test'

test('renter submits and sees dispute', async ({ page }) => {
  // This test assumes the user is already logged in as a renter.
  // In a full suite, you would use a global setup file to handle authentication.
  await page.goto('/renter/disputes/new')
  await page.fill('textarea[name="description"]', 'Testing automation flow')
  await page.click('button:has-text("Submit")')
  await expect(page.locator('text=Dispute submitted')).toBeVisible()
})
