import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/loginPage";

test("login without page object", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("Login with page object", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.emailInput.fill("customer@practicesoftwaretesting.com");
  await page.getByTestId('email').click({
    button: 'right'
  });
  await page.getByTestId('email').fill('customer@practicesoftwaretesting.com');
  await loginPage.passwordInput.fill("welcome01");
  await page.getByTestId('password').click();
  await page.getByTestId('password').click({
    button: 'right'
  });
  await page.getByTestId('password').fill('welcome01');
  await page.getByTestId('login-submit').click();
  await page.getByTestId('nav-menu').click();
  await loginPage.loginButton.click();
  await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
});
