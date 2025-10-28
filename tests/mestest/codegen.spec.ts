import { test, expect } from "@playwright/test";

test("Check Nav bar", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("nav-home")).toBeVisible();
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");
  await page.getByTestId("nav-home").click();
  await expect(page).toHaveURL("/");
});

test("check sign in", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
});

test("validate page title", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");
});

test("check for sort", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.getByRole("heading", { name: "Sort" }).click();
  await expect(page.getByRole("heading", { name: "Sort" })).toBeVisible();
});

test("check for filter", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.getByRole("heading", { name: "Filter" }).click();
  await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
});
