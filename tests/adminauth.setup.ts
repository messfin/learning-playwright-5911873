import { test as setup, expect } from "@playwright/test";

setup.setTimeout(90000);

setup("Create customer 01 auth", async ({ page, context }) => {
  const email = "admin@practicesoftwaretesting.com";
  const password = "welcome01";
  const customer01AuthFile = ".auth/adminuser.json";

  await page.goto("https://practicesoftwaretesting.com/auth/login");

  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);

  await Promise.all([
    page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" }),
    page.locator('input[type="submit"]').click(),
  ]);
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByTestId("nav-menu")).toBeVisible();

  await context.storageState({ path: customer01AuthFile });
});
