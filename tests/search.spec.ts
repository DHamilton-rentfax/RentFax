import { test, expect } from "@playwright/test";

test("Search renter modal loads", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("text=Search Renter");
  await expect(page.locator("text=Full Name")).toBeVisible();
});

test("Search validation works", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("text=Search Renter");
  await page.click("button:has-text('Search')");
  await expect(page.locator("text=Full name is required")).toBeVisible();
});
