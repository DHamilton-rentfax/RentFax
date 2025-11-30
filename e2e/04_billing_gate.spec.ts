import { test, expect } from '@playwright/test';

// This is a simplified test. A true E2E test for billing would involve:
// 1. Using the Stripe CLI or API to create a customer and subscription.
// 2. Sending a webhook event to your function to update the company plan in Firestore.
// 3. Logging into the app as that user and verifying the feature gate's behavior.

test.describe('Billing and Feature Gating', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', process.env.E2E_USER_EMAIL || 'test-owner@example.com');
        await page.fill('input[type="password"]', process.env.E2E_USER_PASSWORD || 'password123');
        await page.click('button:has-text("Sign In")');
        await page.waitForURL('**/dashboard');
    });

    test('shows billing page with portal link', async ({ page }) => {
        await page.goto('/settings/billing');
        await expect(page.locator('h1:has-text("Billing & Subscription")')).toBeVisible();
        const portalLink = page.locator('button:has-text("Open Customer Portal")');
        await expect(portalLink).toBeVisible();
    });

    test('feature gate for AI assistant behaves as expected', async ({ page }) => {
        // This test assumes the test user is on a plan where 'ai_assistant' is enabled (e.g., pro).
        // To test the "locked" state, you would need a separate test user on the 'starter' plan.
        await page.goto('/support');
        await expect(page.locator('h1:has-text("AI Support Assistant")')).toBeVisible();
        
        // The paywall component should NOT be visible.
        await expect(page.locator('text=Upgrade to Unlock')).not.toBeVisible();
        
        // The actual assistant form should be present.
        await expect(page.locator('input[placeholder*="How do I"]')).toBeVisible();
    });
});
