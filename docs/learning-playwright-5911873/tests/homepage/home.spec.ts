import { test, expect } from "@fixtures/base.fixture";

test.describe("Homepage Tests", () => {
  test("Verify homepage elements", async ({ registrationPage }) => {
    // Navigate to the homepage
    await registrationPage.goto();

    // Verify the homepage URL
    await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");

    // Verify the presence of key elements on the homepage
    await expect(registrationPage.accountButton).toBeVisible();
    await expect(registrationPage.registerButton).toBeVisible();
    await expect(registrationPage.modalTitle).toBeVisible();
  });

  test("Check navigation to registration modal", async ({ registrationPage }) => {
    // Open registration modal
    await registrationPage.openRegistrationModal();

    // Verify that the modal is opened
    await expect(registrationPage.registerNowButton).toBeVisible();
  });
});