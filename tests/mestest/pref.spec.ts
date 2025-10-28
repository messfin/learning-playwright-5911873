import { test, expect } from "@playwright/test";

test("Optimized navigation to login page", async ({ page }) => {
  // Navigate to the homepage
  await page.goto("https://practicesoftwaretesting.com");

  // Wait for the page to load and locate the sign-in button
  await page.waitForLoadState("networkidle");
  const signInButton = page.locator('[data-test="nav-sign-in"]');
  await expect(signInButton).toBeVisible();

  // Click the sign-in button
  await signInButton.click();

  // Wait for navigation to complete and verify URL
  await page.waitForURL("https://practicesoftwaretesting.com/auth/login");
  await expect(page).toHaveURL(
    "https://practicesoftwaretesting.com/auth/login"
  );
});
