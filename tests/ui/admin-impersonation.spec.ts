test("impersonation banner lifecycle", async ({ page }) => {
  await page.goto("/admin");

  await page.click("text=Impersonate");

  await expect(
    page.locator("text=Impersonation Active")
  ).toBeVisible();

  await page.click("text=Exit Impersonation");

  await expect(
    page.locator("text=Impersonation Active")
  ).not.toBeVisible();
});
