import { expect, test } from "@playwright/test";

const readGenerateLeadEvents = (page: import("@playwright/test").Page) =>
  page.evaluate(() =>
    ((window as typeof window & { dataLayer?: unknown[] }).dataLayer || []).flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];

      const event = entry as Record<string | number, unknown>;
      if (event.event === "generate_lead") return [event];
      if (event[0] === "event" && event[1] === "generate_lead" && event[2]) {
        return [event[2] as Record<string, unknown>];
      }
      return [];
    }),
  );

test.describe("Public website smoke checks", () => {
  test("homepage loads with primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText("Across Odisha");
    await expect(page.getByRole("link", { name: /book on whatsapp/i }).first()).toBeVisible();
    await expect(page.locator('a[href="tel:+918065481541"]').first()).toBeVisible();
    await expect(page.locator('a[href="tel:+917008990586"]')).toHaveCount(0);
    await expect(page.getByText("15,000+", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Different journeys deserve different fertility care" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recognised for fertility care and innovation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Understand PCOS care" })).toHaveAttribute(
      "href",
      "/pcos-fertility-treatment",
    );
    await expect(page.locator("main")).not.toContainText(/Priya\*|software engineer at Google|From \"Impossible\" to \"Parent\"/i);
    await expect(page.locator("main")).not.toContainText(
      /Four Odisha centre pages|Three active Odisha centres|City-specific enquiry routing|Prefer a calendar view/i,
    );
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

    const leadEvents = await readGenerateLeadEvents(page);
    expect(leadEvents).toHaveLength(1);
    expect(leadEvents[0]).toMatchObject({
      lead_id: "browser-jeypore-lead-1",
      centre: "Jeypore",
      form_name: "jeypore_interest_form",
      gclid: "browser-gclid-1",
    });
  });

  test("direct GA4 fallback loads without the scanner-paused GTM container", async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_ANALYTICS_MODE !== "gtag");

    await page.goto("/");
    await expect(
      page.locator('script[src*="googletagmanager.com/gtag/js?id=G-T5E4SKLMG3"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('script[src*="googletagmanager.com/gtm.js?id=GTM-P45XTFCS"]'),
    ).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(
          () => typeof (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag,
        ),
      )
      .toBe("function");
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

  test("homepage video section does not cause horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#video-testimonials").scrollIntoViewIfNeeded();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });

  test("doctors appear before the research and growth leadership team", async ({ page }) => {
    await page.goto("/our-doctors");

    const team = page.locator("#doctors");
    await expect(team.getByRole("heading", { level: 1 })).toContainText("Odisha doctors");
    await expect(team.getByText("Dr. Deepika KN Padhi", { exact: true })).toBeVisible();
    await expect(team.getByText("Dr. Kaninika Panda", { exact: true })).toBeVisible();
    await expect(team.getByText("Founder & Head of R&D", { exact: true })).toBeVisible();
    await expect(team.getByText("Champion of Growth Projects", { exact: true })).toBeVisible();
    await expect(team.getByText("Femtech Accelerator & Incubator", { exact: true })).toBeVisible();

    const contentOrder = await team.evaluate((section) => section.textContent || "");
    expect(contentOrder.indexOf("Dr. Kaninika Panda")).toBeLessThan(contentOrder.indexOf("Dr. Satish"));

    await page.setViewportSize({ width: 390, height: 844 });
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

    const leadEvents = await readGenerateLeadEvents(page);
    expect(leadEvents).toHaveLength(1);
    expect(leadEvents[0]).toMatchObject({
      lead_id: "browser-lead-1",
      form_name: "at_home_testing_form",
    });

    expect(submissions).toHaveLength(2);
    expect(submissions[1].submissionId).toBe(submissions[0].submissionId);
    expect(submissions[1].occurredAt).toBe(submissions[0].occurredAt);
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

  test("at-home form does not confirm or track a pending response without lead id", async ({ page }) => {
    const submissions: Array<Record<string, unknown>> = [];
    await page.route("**/api/at-home/register", async (route) => {
      submissions.push(route.request().postDataJSON() as Record<string, unknown>);
      if (submissions.length === 1) {
        await route.fulfill({
          status: 202,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            pending: true,
            error: "CRM confirmation is still pending. Please try again in a moment.",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, duplicate: false, leadId: "browser-lead-after-pending" }),
      });
    });

    await page.goto("/at-home-fertility-testing");
    await page.getByRole("button", { name: /register your interest/i }).click();
    await page.getByLabel(/^Name/).fill("Pending Browser Lead");
    await page.getByLabel(/^Phone Number/).fill("9999999999");
    await page.getByRole("button", { name: /request whatsapp follow-up/i }).click();

    await expect(page.getByText(/crm confirmation is still pending/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /request received/i })).toHaveCount(0);
    await expect.poll(() => readGenerateLeadEvents(page)).toHaveLength(0);

    await page.getByRole("button", { name: /request whatsapp follow-up/i }).click();
    await expect(page.getByRole("heading", { name: /request received/i })).toBeVisible();

    const leadEvents = await readGenerateLeadEvents(page);
    expect(leadEvents).toHaveLength(1);
    expect(leadEvents[0]).toMatchObject({
      lead_id: "browser-lead-after-pending",
      form_name: "at_home_testing_form",
    });
    expect(submissions).toHaveLength(2);
    expect(submissions[1].submissionId).toBe(submissions[0].submissionId);
  });
});
