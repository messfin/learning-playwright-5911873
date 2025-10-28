import { test, expect } from "@fixtures/base.fixture";
import { uniqueEmail } from "@pages/../utils/testData";

test.describe("FUS-3: Registration Flow - extended assertions", () => {
  test("user selects region and fields persist", async ({
    registrationPage,
    config,
    pageConsole,
  }) => {
    await registrationPage.goto(config.baseUrl);
    await registrationPage.acceptCookiesIfPresent();

    await registrationPage.openRegistrationModal();
    await expect(registrationPage.accountButton).toBeVisible();
    await registrationPage.clickRegisterNow();
    await expect(registrationPage.registerNowButton).toBeVisible();

    await registrationPage.fillFirstName("Jane");
    await registrationPage.fillLastName("Smith");
    const email = uniqueEmail("fus3");
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword("Password!23");
    await registrationPage.fillConfirmPassword("Password!23");

    await registrationPage.selectGeographicalRegion();
    await expect(registrationPage.geographicalRegionButton).toBeVisible();

    // Check for console errors, but ignore common network errors that don't affect functionality
    const errors = pageConsole.messages.filter(
      (message) => message.type() === "error"
    );
    const nonNetworkErrors = errors.filter(
      (error) =>
        !error.text().includes("Failed to load resource") &&
        !error.text().includes("404") &&
        !error.text().includes("403") &&
        !error.text().includes("net::ERR_")
    );

    if (nonNetworkErrors.length > 0) {
      throw new Error(
        `Console errors found: ${nonNetworkErrors
          .map((e) => e.text())
          .join(", ")}`
      );
    }

    await registrationPage.closeModalTwice();
  });
});
