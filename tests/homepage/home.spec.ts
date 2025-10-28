import { test, expect } from "@playwright/test";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page }) => {
    // Wait for core UI to be ready instead of brittle networkidle
    await page.getByTestId("nav-sign-in").waitFor({ state: "visible" });
    await expect(page.locator(".col-md-9").getByRole("link")).toHaveCount(9);

    // Wait for all images to load and animations to settle
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Additional wait for any animations

    await expect(page).toHaveScreenshot("home-page-no-auth-new1.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop")],
      threshold: 0.2, // Allow for minor visual differences
    });
  });

  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  test("validate page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test authorized", async ({ page }) => {
    // Ensure authenticated header and grid are rendered before snapshot
    await expect(page.getByTestId("nav-sign-in")).toBeVisible();
    await expect(page.locator(".col-md-9").getByRole("link")).toHaveCount(9);

    // Wait for all images to load and animations to settle
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Additional wait for any animations

    await expect(page).toHaveScreenshot("home-page-customer03.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop")],
      threshold: 0.2, // Allow for minor visual differences
    });
  });
  test("check customer 01 is signed in", async ({ page }) => {
    //await expect(page.getByTestId("nav-sign-in")).toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });
});
