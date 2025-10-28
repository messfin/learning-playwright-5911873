import { test as setup, expect } from "@playwright/test";

setup.setTimeout(90000);

setup("Create customer 03 auth", async ({ page, context }) => {
  const email = "customer3@practicesoftwaretesting.com";
  const password = "pass123";
  const customer02AuthFile = ".auth/customer02.json";

  await page.goto("https://practicesoftwaretesting.com/auth/login");

  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);

  await Promise.all([
    page.waitForURL("**/account", { waitUntil: "networkidle" }),
    page.locator('input[type="submit"]').click(),
  ]);
  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByTestId("nav-menu")).toBeVisible();

  await context.storageState({ path: customer02AuthFile });
});
