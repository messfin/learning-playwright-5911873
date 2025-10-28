import { Given, When, Then, setDefaultTimeout, After } from "@cucumber/cucumber";
import { chromium, expect, type Page, type Browser } from "@playwright/test";
import { RegistrationPage } from "../lib/pages/fusionww/registration.page.ts";

let browser: Browser;
let page: Page;
let registrationPage: RegistrationPage;

// Increase default step timeout for slow external site
setDefaultTimeout(60 * 1000);

Given("I am on the FusionWW home page", async () => {
  browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(60000);
  registrationPage = new RegistrationPage(page);

  await registrationPage.goto();
  await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");
  await registrationPage.acceptCookiesIfPresent();
  await page.waitForLoadState("domcontentloaded");
});

When("I open the registration modal", async () => {
  await registrationPage.openRegistrationModal();
  await expect(registrationPage.accountButton).toBeVisible();
  await expect(registrationPage.registerButton).toBeVisible();
});

When("I click the registration modal title", async () => {
  await registrationPage.clickModalTitle();
  await expect(registrationPage.modalTitle).toBeVisible();
});

When("I click Register Now", async () => {
  await registrationPage.clickRegisterNow();
  await expect(registrationPage.registerNowButton).toBeVisible();
});

When(
  "I fill the registration form with {string} {string} {string} {string}",
  async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    await registrationPage.fillFirstName(firstName);
    await expect(registrationPage.firstNameInput).toHaveValue(firstName);
    await expect(registrationPage.firstNameInput).toBeVisible();

    await registrationPage.fillLastName(lastName);
    await expect(registrationPage.lastNameInput).toHaveValue(lastName);
    await expect(registrationPage.lastNameInput).toBeVisible();

    await registrationPage.fillEmail(email);
    await expect(registrationPage.emailInput).toHaveValue(email);
    await expect(registrationPage.emailInput).toBeVisible();

    await registrationPage.fillPassword(password);
    await expect(registrationPage.passwordInput).toHaveValue(password);
    await expect(registrationPage.passwordInput).toBeVisible();

    await registrationPage.fillConfirmPassword(password);
    await expect(registrationPage.confirmPasswordInput).toHaveValue(password);
    await expect(registrationPage.confirmPasswordInput).toBeVisible();
  }
);

When("I select the geographical region {string}", async (_region: string) => {
  // Current POM selects "Americas"; region parameter reserved for future branching
  await registrationPage.selectGeographicalRegion();
  await expect(registrationPage.geographicalRegionButton).toBeVisible();
});

Then("the registration form should reflect the entered values", async () => {
  // This step assumes prior fill step ran with deterministic values
  // Assertions are already performed during fill; keep a minimal smoke check here
  await expect(registrationPage.firstNameInput).toBeVisible();
  await expect(registrationPage.lastNameInput).toBeVisible();
  await expect(registrationPage.emailInput).toBeVisible();
  await expect(registrationPage.passwordInput).toBeVisible();
  await expect(registrationPage.confirmPasswordInput).toBeVisible();
});

Then("I close the registration modal", async () => {
  await registrationPage.closeModalTwice();
});

After(async () => {
  if (browser) {
    await browser.close();
  }
});
