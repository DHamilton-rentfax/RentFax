
import { test, expect } from '@playwright/test'

test('user can sign up and log in', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Log In')
  await page.fill('input[name="email"]', 'demo@rentfax.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/dashboard/)
})
