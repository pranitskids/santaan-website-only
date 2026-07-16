import { expect, test } from "@playwright/test";

test.describe("Public website smoke checks", () => {
  test("homepage loads with primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText("Across Odisha");
    await expect(page.getByRole("link", { name: /book on whatsapp/i }).first()).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/Bangalore|Bengaluru|Jayanagar|Halasuru/i);
  });

  test("content routes stay reachable", async ({ page }) => {
    await page.goto("/fertility-guides");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    await page.goto("/fertility-insights");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("robots endpoint responds", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    await expect.poll(async () => response.text()).toMatch(/User-Agent:/i);
  });

  test("sitemap contains all four Odisha centre pages and excludes the retired landing page", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const xml = await response.text();

    for (const slug of [
      "ivf-clinic-bhubaneswar",
      "ivf-clinic-angul",
      "ivf-clinic-berhampur",
      "ivf-clinic-jeypore",
    ]) {
      expect(xml).toContain(`/${slug}</loc>`);
    }
    expect(xml).not.toContain("ivf-clinic-bangalore-aecs-layout");
  });

  test("Jeypore coming-soon form preserves attribution and emits one confirmed lead event", async ({ page }) => {
    let submission: Record<string, unknown> = {};
    await page.route("**/api/consultation/register", async (route) => {
      submission = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, duplicate: false, leadId: "browser-jeypore-lead-1" }),
      });
    });

    await page.goto(
      "/ivf-clinic-jeypore?utm_source=google&utm_medium=cpc&utm_campaign=jeypore_launch&gclid=browser-gclid-1",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("IVF Centre in Jeypore");
    await expect(page.getByText("Coming soon — opening details are not yet published")).toBeVisible();
    await page.getByLabel("Name", { exact: true }).fill("Jeypore Browser Lead");
    await page.getByLabel("Phone number", { exact: true }).fill("9999999999");
    await page.getByRole("button", { name: "Register my interest", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Request received", exact: true })).toBeVisible();

    expect(submission.centre).toBe("Jeypore");
    expect(submission.utm).toMatchObject({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "jeypore_launch",
      center: "jeypore",
    });
    expect(submission.attribution).toMatchObject({ gclid: "browser-gclid-1" });

    const leadEvents = await page.evaluate(() =>
      ((window as typeof window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer || [])
        .filter((event) => event?.event === "generate_lead"),
    );
    expect(leadEvents).toHaveLength(1);
    expect(leadEvents[0]).toMatchObject({
      lead_id: "browser-jeypore-lead-1",
      centre: "Jeypore",
      form_name: "jeypore_interest_form",
      gclid: "browser-gclid-1",
    });
  });

  test("at-home form remains usable without horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/at-home-fertility-testing");
    await page.getByRole("button", { name: /register your interest/i }).click();
    await expect(page.getByRole("heading", { name: /book at-home testing/i })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });

  test("at-home form preserves attribution and submission id across a retry", async ({ page }) => {
    const submissions: Array<Record<string, unknown>> = [];
    await page.route("**/api/at-home/register", async (route) => {
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      submissions.push(payload);
      if (submissions.length === 1) {
        await route.fulfill({
          status: 502,
          contentType: "application/json",
          body: JSON.stringify({ error: "Temporary CRM test failure" }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, duplicate: false, leadId: "browser-lead-1" }),
      });
    });

    await page.goto(
      "/at-home-fertility-testing?utm_source=meta&utm_medium=paid_social&utm_campaign=odisha_ivf&fbclid=browser-click-1&ad_id=browser-ad-1",
    );
    await page.getByRole("button", { name: /register your interest/i }).click();
    await page.getByLabel(/^Name/).fill("Browser QA Lead");
    await page.getByLabel(/^Phone Number/).fill("9999999999");
    await page.getByRole("button", { name: /request whatsapp follow-up/i }).click();
    await expect(page.getByText("Temporary CRM test failure")).toBeVisible();

    await page.getByRole("button", { name: /request whatsapp follow-up/i }).click();
    await expect(page.getByRole("heading", { name: /request received/i })).toBeVisible();

    expect(submissions).toHaveLength(2);
    expect(submissions[1].submissionId).toBe(submissions[0].submissionId);
    expect(submissions[0].utm).toMatchObject({
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "odisha_ivf",
    });
    expect(submissions[0].attribution).toMatchObject({
      fbclid: "browser-click-1",
      ad_id: "browser-ad-1",
    });
  });
});
