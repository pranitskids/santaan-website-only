import { expect, test } from "@playwright/test";

test.describe("Public website smoke checks", () => {
  test("homepage loads with primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /book on whatsapp/i }).first()).toBeVisible();
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
