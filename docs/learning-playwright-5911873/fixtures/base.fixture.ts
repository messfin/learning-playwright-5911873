import { test as base, expect } from "@playwright/test";

export const test = base.extend({registrationPage: async ({ page }, use) => {
    // Setup code for the registration page fixture
    await use({
      page,
      goto: async () => {
        await page.goto("https://www.fusionww.com/");
      },
      acceptCookiesIfPresent: async () => {
        const acceptButton = page.locator('button[data-test="accept-cookies"]');
        if (await acceptButton.isVisible()) {
          await acceptButton.click();
        }
      },
      openRegistrationModal: async () => {
        await page
          .locator('button[data-test="open-registration-modal"]')
          .click();
      },
      clickModalTitle: async () => {
        await page.locator('h2[data-test="modal-title"]').click();
      },
      clickRegisterNow: async () => {
        await page.locator('button[data-test="register-now"]').click();
      },
      fillFirstName: async (firstName) => {
        await page.fill('input[data-test="first-name"]', firstName);
      },
      fillLastName: async (lastName) => {
        await page.fill('input[data-test="last-name"]', lastName);
      },
      fillEmail: async (email) => {
        await page.fill('input[data-test="email"]', email);
      },
      selectGeographicalRegion: async () => {
        await page.locator('button[data-test="geographical-region"]').click();
        await page.locator('option[data-test="americas"]').click();
      },
      fillPassword: async (password) => {
        await page.fill('input[data-test="password"]', password);
      },
      fillConfirmPassword: async (confirmPassword) => {
        await page.fill('input[data-test="confirm-password"]', confirmPassword);
      },
      closeModalTwice: async () => {
        await page.locator('button[data-test="close-modal"]').click();
        await page.locator('button[data-test="close-modal"]').click();
      },
      // Add locators for buttons and inputs
      accountButton: page.locator('button[data-test="account-button"]'),
      registerButton: page.locator('button[data-test="register-button"]'),
      modalTitle: page.locator('h2[data-test="modal-title"]'),
      registerNowButton: page.locator('button[data-test="register-now"]'),
      firstNameInput: page.locator('input[data-test="first-name"]'),
      lastNameInput: page.locator('input[data-test="last-name"]'),
      emailInput: page.locator('input[data-test="email"]'),
      geographicalRegionButton: page.locator(
        'button[data-test="geographical-region"]'
      ),
      passwordInput: page.locator('input[data-test="password"]'),
      confirmPasswordInput: page.locator('input[data-test="confirm-password"]'),
    });
  },
});
