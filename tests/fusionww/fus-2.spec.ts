import { test, expect } from "@fixtures/base.fixture";
import { uniqueEmail } from "@pages/../utils/testData";

test.describe("FUS-2: Registration Flow", () => {
  test.setTimeout(90_000);

  test("user can open registration and fill form", async ({
    registrationPage,
    config,
  }) => {
    await registrationPage.goto(config.baseUrl);
    await expect(registrationPage.page).toHaveURL(/fusionww/);
    await registrationPage.acceptCookiesIfPresent();

    await registrationPage.openRegistrationModal();
    await expect(registrationPage.accountButton).toBeVisible();
    await expect(registrationPage.registerButton).toBeVisible();

    await registrationPage.clickModalTitle();
    await expect(registrationPage.modalTitle).toBeVisible();

    await registrationPage.clickRegisterNow();
    await expect(registrationPage.registerNowButton).toBeVisible();

    await registrationPage.fillFirstName("John");
    await expect(registrationPage.firstNameInput).toHaveValue("John");

    await registrationPage.fillLastName("Doe");
    await expect(registrationPage.lastNameInput).toHaveValue("Doe");

    const email = uniqueEmail("fus2");
    await registrationPage.fillEmail(email);
    await expect(registrationPage.emailInput).toHaveValue(email);

    await registrationPage.selectGeographicalRegion();
    await expect(registrationPage.geographicalRegionButton).toBeVisible();

    await registrationPage.fillPassword("password123");
    await expect(registrationPage.passwordInput).toHaveValue("password123");

    await registrationPage.fillConfirmPassword("password123");
    await expect(registrationPage.confirmPasswordInput).toHaveValue(
      "password123"
    );

    await registrationPage.closeModalTwice();
  });
});


