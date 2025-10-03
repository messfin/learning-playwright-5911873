import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");
  await page.getByTestId ("nav-home").click();
  await expect(page).toHaveURL("https://practicesoftwaretesting.com/");
});
