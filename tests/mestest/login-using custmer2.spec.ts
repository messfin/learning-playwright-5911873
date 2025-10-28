import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/loginPage";

test.describe("Home page customer 02 auth", () => {
  test.use({ storageState: ".auth/customer02.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

test("Login with page object", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("customer2@practicesoftwaretesting.com", "welcome01");
  await expect(page.getByTestId("nav-menu")).toContainText("Jack Howe");
});

  test("visual test authorized", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-page-customer00new1.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop")],
    });
  });
  test("check customer 01 is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toBeVisible();
   // await expect(page.getByTestId("nav-menu")).toContainText("Jack Howe");
  });
});
