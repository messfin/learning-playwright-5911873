import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../lib/pages/fusionww/registration.page";

test.setTimeout(90_000);

test("FusionWW Registration Flow", async ({ page }) => {
  // Initialize registration page
  const registrationPage = new RegistrationPage(page);

  // Given: I am on the FusionWW home page
  await registrationPage.goto();
  await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");

  // Accept cookies if present
  await registrationPage.acceptCookiesIfPresent();
  await page.waitForLoadState("domcontentloaded");

  // When: I open the registration modal
  await registrationPage.openRegistrationModal();

  // Verify modal opened successfully
  await expect(registrationPage.accountButton).toBeVisible({ timeout: 10000 });
  await expect(registrationPage.registerButton).toBeVisible({ timeout: 10000 });

  // When: I click the registration modal title
  await registrationPage.clickModalTitle();
  await expect(registrationPage.modalTitle).toBeVisible({ timeout: 10000 });

  // When: I click Register Now
  await registrationPage.clickRegisterNow();
  await expect(registrationPage.registerNowButton).toBeVisible({
    timeout: 10000,
  });

  // When: I fill the registration form with John Doe john.doe@example.com password123
  await registrationPage.fillFirstName("John");
  await expect(registrationPage.firstNameInput).toHaveValue("John");

  await registrationPage.fillLastName("Doe");
  await expect(registrationPage.lastNameInput).toHaveValue("Doe");

  await registrationPage.fillEmail("john.doe@example.com");
  await expect(registrationPage.emailInput).toHaveValue("john.doe@example.com");

  await registrationPage.fillPassword("password123");
  await expect(registrationPage.passwordInput).toHaveValue("password123");

  await registrationPage.fillConfirmPassword("password123");
  await expect(registrationPage.confirmPasswordInput).toHaveValue(
    "password123"
  );

  // When: I select the geographical region Americas
  await registrationPage.selectGeographicalRegion("Americas");
  await expect(registrationPage.geographicalRegionButton).toBeVisible({
    timeout: 10000,
  });

  // Then: the registration form should reflect the entered values
  const inputs = [
    registrationPage.firstNameInput,
    registrationPage.lastNameInput,
    registrationPage.emailInput,
    registrationPage.passwordInput,
    registrationPage.confirmPasswordInput,
  ];

  for (const input of inputs) {
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).not.toBeEmpty();
  }

  // Then: I close the registration modal
  await registrationPage.closeModalTwice();

  // Wait for modal to close and verify it's no longer visible
  await page.waitForTimeout(2000);
  await expect(registrationPage.modalTitle).not.toBeVisible({ timeout: 10000 });
});
