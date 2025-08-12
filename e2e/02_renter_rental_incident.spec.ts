import { test, expect } from '@playwright/test';

test.describe('Renter, Rental, and Incident Flow', () => {
  let renterId: string;
  let incidentId: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    // This is a simplified login flow. In a real test suite, you'd
    // likely have a global setup file to handle auth once.
    await page.goto('/login');
    // Use credentials for a pre-existing test user
    await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
    await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
    
    // Create Renter
    await page.goto('/renters');
    await page.click('button:has-text("Add Renter")');
    await page.fill('input[name="name"]', 'Testy McRenter');
    await page.fill('input[name="email"]', `testy-${Date.now()}@example.com`);
    await page.fill('input[name="licenseNumber"]', 'X1234567');
    await page.fill('input[name="licenseState"]', 'CA');
    await page.fill('input[name="dob"]', '1990-01-01');
    await page.click('button:has-text("Save Renter")');
    await expect(page.locator('text=Renter Created')).toBeVisible();

    await page.goto('/renters');
    const renterLink = page.locator('a:has-text("Testy McRenter")');
    await expect(renterLink).toBeVisible();
    const href = await renterLink.getAttribute('href');
    renterId = href!.split('/').pop()!;
    
    // This part is a stub as there's no UI to create an incident directly on the incident list page yet
    // In a real scenario, you'd go to a renter, click "Add Incident", fill a form, and save.
    // For now, we'll assume an incident has been created via another flow to test the detail page.
    incidentId = 'stub-incident-id'; // This will be improved when incident creation UI is added.
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Login for each test
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
    await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('create renter -> score is visible', async ({ page }) => {
    await page.goto('/renters');
    await expect(page.locator('text=Testy McRenter')).toBeVisible();
    // A basic score should be visible. We aren't testing the value, just its presence.
    const riskScoreBadge = page.locator(`//tr[contains(., "Testy McRenter")]/td/div[contains(@class, "badge")]`).first();
    await expect(riskScoreBadge).toBeVisible();
  });

  test('AI Risk Explain works for a seeded renter', async ({ page }) => {
    test.skip(!renterId, 'Renter not created in beforeAll hook');
    await page.goto(`/renters/${renterId}`);
    await page.click('button:has-text("Explain Score with AI")');
    const explanation = page.locator('[class*="whitespace-pre-wrap"]');
    await expect(explanation).toBeVisible();
    await expect(explanation).toContainText('risk');
  });

  test('AI Incident Assist works for an incident', async ({ page }) => {
    test.skip(!incidentId || incidentId === 'stub-incident-id', 'Incident not created yet. Cannot test detail page.');
    await page.goto(`/incidents/${incidentId}`);
    
    await page.fill('textarea[placeholder*="extra context"]', 'The driver seemed nervous.');
    await page.click('button:has-text("Generate Summary")');
    
    const summary = page.locator('h3:has-text("Summary") + p');
    await expect(summary).toBeVisible();
    await expect(summary).not.toBeEmpty();

    const checklist = page.locator('h3:has-text("Checklist") + ul');
    await expect(checklist).toBeVisible();
    await expect(checklist.locator('li')).toHaveCount(5);
  });
});
