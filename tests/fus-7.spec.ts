
import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../lib/pages/fusionww/registration.page";

test.setTimeout(60_000);

test.describe("FusionWW Registration", () => {
  test("should validate registration form with invalid inputs", async ({
    page,
  }) => {
    const registrationPage = new RegistrationPage(page);

    await test.step("Navigate to FusionWW home page", async () => {
      await registrationPage.goto();
      await expect(registrationPage.page).toHaveURL(
        "https://www.fusionww.com/"
      );
    });

    await test.step("Accept cookies", async () => {
      await registrationPage.acceptCookiesIfPresent();
      await page.waitForLoadState("domcontentloaded");
    });

    await test.step("Open registration modal", async () => {
      await registrationPage.openRegistrationModal();
      await expect(registrationPage.accountButton).toBeVisible({
        timeout: 5000,
      });
      await expect(registrationPage.registerButton).toBeVisible({
        timeout: 5000,
      });
    });

    await test.step("Navigate to registration form", async () => {
      await registrationPage.clickModalTitle();
      await expect(registrationPage.modalTitle).toBeVisible({ timeout: 5000 });

      await registrationPage.clickRegisterNow();
      await expect(registrationPage.registerNowButton).toBeVisible({
        timeout: 5000,
      });
    });

    await test.step("Fill registration form with invalid data", async () => {
      const testData = {
        firstName: "000",
        lastName: "Smith",
        email: "alice.smith@invalid",
        password: "11",
        confirmPassword: "22",
        region: "Americas",
      };

      await registrationPage.fillFirstName(testData.firstName);
      await registrationPage.fillLastName(testData.lastName);
      await registrationPage.fillEmail(testData.email);
      await registrationPage.fillPassword(testData.password);
      await registrationPage.fillConfirmPassword(testData.confirmPassword);
      await registrationPage.selectGeographicalRegion(testData.region);

      // Verify all inputs
      await expect(registrationPage.firstNameInput).toHaveValue(
        testData.firstName
      );
      await expect(registrationPage.lastNameInput).toHaveValue(
        testData.lastName
      );
      await expect(registrationPage.emailInput).toHaveValue(testData.email);
      await expect(registrationPage.passwordInput).toHaveValue(
        testData.password
      );
      await expect(registrationPage.confirmPasswordInput).toHaveValue(
        testData.confirmPassword
      );
      await expect(registrationPage.geographicalRegionButton).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("Verify password validation error", async () => {
      await expect(registrationPage.modalErrorMessage).toBeVisible({
        timeout: 5000,
      });
      await expect(registrationPage.modalErrorMessage).toHaveText(
        "Minimum 8 characters, One lowercase letter, One uppercase letter, One number, One special character"
      );
    });

    await test.step("Verify email validation error", async () => {
      await expect(registrationPage.modalContent).toBeVisible({
        timeout: 5000,
      });
      await expect(registrationPage.modalContent).toHaveText(
        "Please provide a valid email address"
      );
    });


     await test.step("Verify first Name filed valdation error", async () => {
       await expect(registrationPage.modalErrorConfirmNameMessage).toBeVisible({
         timeout: 5000,
       });
       await expect(registrationPage.modalErrorConfirmNameMessage).toHaveText(
         "Invalid characters"
       );
     });

    await test.step("Close registration modal", async () => {
      await registrationPage.closeModalTwice();
      await page.waitForTimeout(1000);
      await expect(registrationPage.modalTitle).not.toBeVisible({
        timeout: 5000,
      });
    });
  });
});
