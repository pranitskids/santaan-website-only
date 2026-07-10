import { expect, test } from "@playwright/test";

test.describe("Public website smoke checks", () => {
  test("homepage loads with primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /book on whatsapp/i }).first()).toBeVisible();
  });

  test("CTA intent preserves attribution without generating a lead", async ({ page }) => {
    let intentPayload: Record<string, unknown> | null = null;
    await page.route("**/api/website/intent", async (route) => {
      intentPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"sent":true}' });
    });

    await page.goto("/?utm_source=meta&utm_medium=paid_social&utm_campaign=ivf_test&gclid=gclid-test&fbclid=fbclid-test");
    await page.evaluate(() => {
      document.cookie = "_fbp=fb.1.123456789.fbp-test; path=/";
      document.cookie = "_fbc=fb.1.123456789.fbclid-test; path=/";
    });

    const cta = page.getByRole("link", { name: /book on whatsapp/i }).first();
    await cta.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault(), { once: true }));
    await cta.click();

    await expect.poll(() => intentPayload).not.toBeNull();
    expect(intentPayload).toMatchObject({
      event_name: "Contact",
      kind: "whatsapp",
      gclid: "gclid-test",
      fbp: "fb.1.123456789.fbp-test",
      fbc: "fb.1.123456789.fbclid-test",
      utm: {
        utm_source: "meta",
        utm_medium: "paid_social",
        utm_campaign: "ivf_test",
      },
    });

    const eventNames = await page.evaluate(() => {
      const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
      return dataLayer.flatMap((entry) => {
        if (Array.isArray(entry) || (typeof entry === "object" && entry !== null && "length" in entry)) {
          const values = Array.from(entry as ArrayLike<unknown>);
          return values[0] === "event" ? [String(values[1])] : [];
        }
        if (typeof entry === "object" && entry !== null && "event" in entry) {
          return [String((entry as { event: unknown }).event)];
        }
        return [];
      });
    });

    expect(eventNames).toContain("whatsapp_click");
    expect(eventNames).not.toContain("generate_lead");
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
    await expect.poll(async () => response.text()).toContain("User-agent");
  });
});
