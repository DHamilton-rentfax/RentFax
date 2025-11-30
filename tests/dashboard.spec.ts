test("Super Admin sees alerts and audit logs", async ({ page }) => {
  await loginAs(page, "SUPER_ADMIN");

  // Alerts
  await expect(page.getByText("High fraud activity detected")).toBeVisible();
  await expect(page.getByText("System maintenance scheduled")).toBeVisible();

  // Audit Logs
  await expect(page.getByText("INVITE_SENT")).toBeVisible();
  await expect(page.getByText("DISPUTE_UPDATED")).toBeVisible();
});
