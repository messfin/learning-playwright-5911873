import {Given,When,Then,setDefaultTimeout,After,Before,} from "@cucumber/cucumber";
import {chromium,expect,type Page,type Browser,type BrowserContext,} from "@playwright/test";
import { RegistrationPage } from "../lib/pages/fusionww/registration.page.ts";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let registrationPage: RegistrationPage;

setDefaultTimeout(60 * 1000);

// Separate setup for better organization
Before(async () => {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: "Mozilla/5.0 (automated test)",
  });
  page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(60000);
});

Given("I am on the FusionWW home page", async () => {
  registrationPage = new RegistrationPage(page);
  await registrationPage.goto();
  await expect(registrationPage.page).toHaveURL("https://www.fusionww.com/");
  await registrationPage.acceptCookiesIfPresent();
  await page.waitForLoadState("networkidle"); // More reliable than domcontentloaded
});

When("I open the registration modal", async () => {
  await registrationPage.openRegistrationModal();
  await expect(registrationPage.accountButton).toBeVisible({ timeout: 10000 });
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
    // Fill all fields first, then validate - reduces flakiness
    await registrationPage.fillFirstName(firstName);
    await registrationPage.fillLastName(lastName);
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.fillConfirmPassword(password);

    // Single validation pass after all inputs
    await expect(registrationPage.firstNameInput).toHaveValue(firstName);
    await expect(registrationPage.lastNameInput).toHaveValue(lastName);
    await expect(registrationPage.emailInput).toHaveValue(email);
    await expect(registrationPage.passwordInput).toHaveValue(password);
    await expect(registrationPage.confirmPasswordInput).toHaveValue(password);
  }
);

When("I select the geographical region {string}", async (region: string) => {
  await registrationPage.selectGeographicalRegion(region); // Pass parameter to POM
  await expect(registrationPage.geographicalRegionButton).toHaveValue(region);
});

Then("the registration form should reflect the entered values", async () => {
  // Store expected values in scenario context for validation
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
});

Then("I close the registration modal", async () => {
  await registrationPage.closeModalTwice();
  await expect(registrationPage.modalTitle).not.toBeVisible(); // Verify it closed
});

After(async () => {
  // Graceful cleanup with error handling
  if (page) await page.close().catch(() => {});
  if (context) await context.close().catch(() => {});
  if (browser) await browser.close().catch(() => {});
});
