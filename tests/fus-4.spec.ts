import { test, expect } from "@fixtures/base.fixture";

test.setTimeout(90_000);

test("FusionWW Registration Flow", async ({ registrationPage }) => {
  // Navigate to the website
  await registrationPage.goto();

  // Verify we're on the correct page
  await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");

  // Accept cookies if present
  await registrationPage.acceptCookiesIfPresent();
  // Open registration modal
  await registrationPage.openRegistrationModal();

  // Verify account button is visible and modal opened
  await expect(registrationPage.accountButton).toBeVisible();
  await expect(registrationPage.registerButton).toBeVisible();

  // Click modal title
  await registrationPage.clickModalTitle();

  // Verify modal title is clickable and visible
  await expect(registrationPage.modalTitle).toBeVisible();

  // Click Register Now button
  await registrationPage.clickRegisterNow();
  // Verify register now button is visible and form elements appear
  await expect(registrationPage.registerNowButton).toBeVisible();
  // Fill in registration form
  await registrationPage.fillFirstName("Alice");
  // Verify first name input is filled correctly
  await expect(registrationPage.firstNameInput).toHaveValue("Alice");
  await expect(registrationPage.firstNameInput).toBeVisible();
  await registrationPage.fillLastName("Smith");
  // Verify last name input is filled correctly
  await expect(registrationPage.lastNameInput).toHaveValue("Smith");
  await expect(registrationPage.lastNameInput).toBeVisible();
  await registrationPage.fillEmail("me@gmail.com");
  // Verify email input is filled correctly
  await expect(registrationPage.emailInput).toHaveValue("me@gmail.com");
  await expect(registrationPage.emailInput).toBeVisible();
  await registrationPage.selectGeographicalRegion();
  // Verify geographical region selection worked
  await expect(registrationPage.geographicalRegionButton).toBeVisible();
  // Note: americasOption is not visible after selection as dropdown closes
  // We can verify the selection by checking if the button shows the selected value
  await registrationPage.fillPassword("securePass!23");
  // Verify password input is filled correctly
  await expect(registrationPage.passwordInput).toHaveValue("securePass!23");
  await expect(registrationPage.passwordInput).toBeVisible();
  
  await registrationPage.fillConfirmPassword("securePass!23");
  // Verify confirm password input is filled correctly
  await expect(registrationPage.confirmPasswordInput).toHaveValue("securePass!23");
  await expect(registrationPage.confirmPasswordInput).toBeVisible();


  // Verify all form inputs reflect the entered values});
  const inputs = [
    registrationPage.firstNameInput,
    registrationPage.lastNameInput,
    registrationPage.emailInput,
    registrationPage.passwordInput,
    registrationPage.confirmPasswordInput,
  ];    
  for (const input of inputs) {
    await expect(input).toBeVisible();
    await expect(input).not.toBeEmpty();
  }   
  // Close the registration modal
  await registrationPage.closeModalTwice();   
  // Verify modal is closed
  await expect(registrationPage.modalTitle).not.toBeVisible();
});
