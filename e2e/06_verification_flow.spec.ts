import { test, expect } from "@playwright/test";

test.describe("RentFAX Verification Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard before each test
    await page.goto("/dashboard");

    // Mock the successful login by setting a cookie or local storage
    await page.context().addCookies([{
      name: "auth-token",
      value: "your-mock-auth-token",
      url: new URL(page.url()).origin
    }]);
  });

  test("should search and find existing report", async ({ page }) => {
    // Mock the API response for the search
    await page.route("**/api/reports/search", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ found: true, report: { renterName: "John Doe" }, status: "fresh" }),
      });
    });

    await page.click("text=Search Reports");
    await page.fill("input[name='name']", "John Doe");
    await page.fill("input[name='licenseNumber']", "A123456");
    await page.click("text=Search");

    await expect(page.locator('text="Report found"')).toBeVisible();
  });

  test("should prompt payment if no report found", async ({ page }) => {
    // Mock the API response for the search
    await page.route("**/api/reports/search", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ found: false }),
      });
    });

    // Mock the redirect to Stripe
    await page.route("**/api/payments/deep-report", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://stripe.com/mock-checkout" }),
      });
    });

    await page.click("text=Search Reports");
    await page.fill("input[name='name']", "Nonexistent Person");
    await page.click("text=Search");
    
    // Since the test environment can't actually navigate to Stripe, 
    // we will just check that the call was made.
    // To do this, we can check for a navigation event to the stripe url
    const response = await page.waitForResponse('**/api/payments/deep-report');
    expect(response.status()).toBe(200);

  });

  test("should create unauthorized driver report", async ({ page }) => {
    await page.route("**/api/admin/unauthorized-drivers", async (route) => {
        await route.fulfill({ 
            status: 200, 
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
        });
    });
    
    await page.click("text=Report Unauthorized Driver");
    await page.fill("input[name='driverName']", "Alex Fraud");
    await page.fill("input[name='licenseNumber']", "U9999XYZ");
    await page.fill("textarea[name='description']", "Driver used rental without authorization.");
    await page.click("text=Submit Unauthorized Driver Report");

    await expect(page.locator('text="Report Submitted"')).toBeVisible();
  });
});
