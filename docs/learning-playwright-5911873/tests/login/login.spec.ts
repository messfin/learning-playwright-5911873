import { test, expect } from "@fixtures/base.fixture";
import { LoginPage } from "../../pages/login/loginPage";

test.describe("Login Functionality", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("User can log in with valid credentials", async () => {
    await loginPage.fillEmail("john.doe@example.com");
    await loginPage.fillPassword("password123");
    await loginPage.clickLoginButton();

    // Verify successful login
    await expect(loginPage.successMessage).toBeVisible();
    await expect(loginPage.page).toHaveURL("https://www.fusionww.com/dashboard");
  });

  test("User cannot log in with invalid credentials", async () => {
    await loginPage.fillEmail("invalid@example.com");
    await loginPage.fillPassword("wrongpassword");
    await loginPage.clickLoginButton();

    // Verify error message is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Invalid email or password.");
  });

  test("Login form validation", async () => {
    await loginPage.clickLoginButton();

    // Verify validation messages for empty fields
    await expect(loginPage.emailInput).toHaveAttribute("aria-invalid", "true");
    await expect(loginPage.passwordInput).toHaveAttribute("aria-invalid", "true");
  });
});