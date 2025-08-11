import { test, expect } from '@playwright/test';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
    await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('Analytics page loads company stats and charts', async ({ page }) => {
    await page.goto('/analytics');
    
    // Check for stat cards
    const rentersCard = page.locator('div:has-text("Total Renters")').first();
    const incidentsCard = page.locator('div:has-text("Total Incidents")').first();
    
    await expect(rentersCard.locator('.text-2xl')).not.toHaveText('0');
    await expect(incidentsCard.locator('.text-2xl')).not.toHaveText('0');

    // Check for charts
    await expect(page.locator('text=Risk Distribution')).toBeVisible();
    await expect(page.locator('text=Incident Mix')).toBeVisible();
    
    // Check for chart content (presence of SVG rendered by recharts)
    await expect(page.locator('g.recharts-pie-sector')).toBeVisible();
    await expect(page.locator('g.recharts-bar-rectangle')).toBeVisible();
  });
});

    