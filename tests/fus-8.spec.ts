import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../lib/pages/fusionww/registration.page";

test.setTimeout(60_000);

test.describe("FusionWW Registration", () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");
    await registrationPage.acceptCookiesIfPresent();
    await page.waitForLoadState("domcontentloaded");
  });

  test("should navigate to FusionWW home page", async () => {
    await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");
  });

  test("should open registration modal successfully", async () => {
    await registrationPage.openRegistrationModal();
    await expect(registrationPage.accountButton).toBeVisible({ timeout: 5000 });
    await expect(registrationPage.registerButton).toBeVisible({
      timeout: 5000,
    });
  });

  test("should display modal title when clicked", async () => {
    await registrationPage.openRegistrationModal();
    await registrationPage.clickModalTitle();
    await expect(registrationPage.modalTitle).toBeVisible({ timeout: 5000 });
  });

  test("should display register now button", async () => {
    await registrationPage.openRegistrationModal();
    await registrationPage.clickModalTitle();
    await registrationPage.clickRegisterNow();
    await expect(registrationPage.registerNowButton).toBeVisible({
      timeout: 5000,
    });
  });

  test("should accept valid form inputs", async () => {
    const testData = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@invalid",
      password: "11",
      confirmPassword: "22",
      region: "Americas",
    };

    await registrationPage.openRegistrationModal();
    await registrationPage.clickModalTitle();
    await registrationPage.clickRegisterNow();

    await registrationPage.fillFirstName(testData.firstName);
    await registrationPage.fillLastName(testData.lastName);
    await registrationPage.fillEmail(testData.email);
    await registrationPage.fillPassword(testData.password);
    await registrationPage.fillConfirmPassword(testData.confirmPassword);
    await registrationPage.selectGeographicalRegion(testData.region);

    await expect(registrationPage.firstNameInput).toHaveValue(
      testData.firstName
    );
    await expect(registrationPage.lastNameInput).toHaveValue(testData.lastName);
    await expect(registrationPage.emailInput).toHaveValue(testData.email);
    await expect(registrationPage.passwordInput).toHaveValue(testData.password);
    await expect(registrationPage.confirmPasswordInput).toHaveValue(
      testData.confirmPassword
    );
    await expect(registrationPage.geographicalRegionButton).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display error for invalid password", async () => {
    await registrationPage.openRegistrationModal();
    await registrationPage.clickModalTitle();
    await registrationPage.clickRegisterNow();

    await registrationPage.fillPassword("11");
    await registrationPage.fillConfirmPassword("22");

    await expect(registrationPage.modalErrorMessage).toBeVisible({
      timeout: 5000,
    });
    await expect(registrationPage.modalErrorMessage).toHaveText(
      "Minimum 8 characters, One lowercase letter, One uppercase letter, One number, One special character"
    );
  });

  test("should display error for invalid email", async () => {
    await registrationPage.openRegistrationModal();
    await registrationPage.clickModalTitle();
    await registrationPage.clickRegisterNow();

    await registrationPage.fillEmail("alice.smith@invalid");
    

    await expect(registrationPage.modalContent).toBeVisible({ timeout: 5000 });
    await expect(registrationPage.modalContent).toHaveText(
      "Please provide a valid email address"
    );
  });

  test("should close registration modal successfully", async ({ page }) => {
    await registrationPage.openRegistrationModal();
    await registrationPage.closeModalTwice();

    await page.waitForTimeout(1000);
    await expect(registrationPage.modalTitle).not.toBeVisible({
      timeout: 5000,
    });
  });
});
