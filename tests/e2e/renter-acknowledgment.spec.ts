import { test, expect, Page } from "@playwright/test";

/* ---------------------------------------------------------
 * CONFIG
 * -------------------------------------------------------- */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const TEST_RENTER_EMAIL = process.env.TEST_RENTER_EMAIL!;
const TEST_RENTER_PASSWORD = process.env.TEST_RENTER_PASSWORD!;
const TEST_REPORT_ID = process.env.TEST_REPORT_ID!;

/* ---------------------------------------------------------
 * HELPERS
 * -------------------------------------------------------- */
async function loginAsRenter(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  await page.fill('input[type="email"]', TEST_RENTER_EMAIL);
  await page.fill('input[type="password"]', TEST_RENTER_PASSWORD);

  await page.getByRole("button", { name: /sign in|login/i }).click();

  await page.waitForURL(/dashboard|reports/, { timeout: 15_000 });
}

/* ---------------------------------------------------------
 * TEST SUITE
 * -------------------------------------------------------- */
test.describe("Renter Acknowledgment Flow (Production)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRenter(page);
  });

  /* ------------------------------
   * FLOW 1 — PAGE LOAD
   * ------------------------------ */
  test("loads acknowledgment page correctly", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/reports/${TEST_REPORT_ID}/acknowledge`
    );

    await expect(page.getByText("Action Required")).toBeVisible();
    await expect(page.getByText("YES, I am renting")).toBeVisible();
    await expect(page.getByText("NO, this is incorrect")).toBeVisible();
    await expect(page.getByText("This is FRAUD")).toBeVisible();
  });

  /* ------------------------------
   * FLOW 2 — YES (IMMEDIATE)
   * ------------------------------ */
  test("YES confirmation updates report immediately", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/reports/${TEST_REPORT_ID}/acknowledge`
    );

    await page
      .getByRole("button", { name: /confirm yes/i })
      .click();

    await page.waitForURL(
      /acknowledge\/success\?action=YES/,
      { timeout: 15_000 }
    );

    await expect(
      page.getByText("Confirmation Successful")
    ).toBeVisible();
  });

  /* ------------------------------
   * FLOW 3 — NO (DOUBLE OPT-IN)
   * ------------------------------ */
  test("NO triggers pending confirmation flow", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/reports/${TEST_REPORT_ID}/acknowledge`
    );

    await page
      .getByRole("button", { name: /choose no/i })
      .click();

    await expect(
      page.getByText("Confirm Your Choice")
    ).toBeVisible();

    await page
      .getByRole("button", { name: /continue/i })
      .click();

    await page.waitForURL(
      /acknowledge\/pending\?action=NO/,
      { timeout: 15_000 }
    );

    await expect(
      page.getByText("Please Check for a Confirmation Link")
    ).toBeVisible();
  });

  /* ------------------------------
   * FLOW 4 — FRAUD (HIGH RISK)
   * ------------------------------ */
  test("FRAUD triggers high-risk confirmation flow", async ({ page }) => {
    await page.goto(
      `${BASE_URL}/reports/${TEST_REPORT_ID}/acknowledge`
    );

    await page
      .getByRole("button", { name: /report fraud/i })
      .click();

    await expect(
      page.getByText("Confirm Fraud Report")
    ).toBeVisible();

    await page
      .getByRole("button", { name: /report as fraud/i })
      .click();

    await page.waitForURL(
      /acknowledge\/pending\?action=FRAUD/,
      { timeout: 15_000 }
    );

    await expect(
      page.getByText("Please Check for a Confirmation Link")
    ).toBeVisible();
  });

  /* ------------------------------
   * SECURITY — TOKEN PROTECTION
   * ------------------------------ */
  test("cannot access confirmation token directly", async ({ page }) => {
    await page.goto(`${BASE_URL}/confirm/FAKE_TOKEN_123`);

    await expect(
      page.getByText(/expired|invalid|used/i)
    ).toBeVisible();
  });

  /* ------------------------------
   * SECURITY — AUTH GUARD
   * ------------------------------ */
  test("unauthenticated renter cannot access acknowledgment page", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    await page.goto(
      `${BASE_URL}/reports/${TEST_REPORT_ID}/acknowledge`
    );

    await expect(page).toHaveURL(
      /login|unauthorized|404/
    );
  });
});
