import { test, expect } from "@fixtures/practice-software-testing.fixture";
import { RegistrationData } from "@pages/practice-software-testing/registration.page";

test.describe("Bug Hunting and Registration Flow", () => {
  test("Complete bug hunting and user registration flow", async ({
    practiceHomepage,
    bugHuntingPage,
    practiceRegistration,
    page,
  }) => {
    // Navigate to homepage and verify categories
    await practiceHomepage.goto();
    await practiceHomepage.verifyCategoriesVisible();

    // Open bug hunting popup
    const bugHuntingPopupPromise = practiceHomepage.page.waitForEvent("popup");
    await practiceHomepage.clickBugHuntingButton();
    const bugHuntingPopup = await bugHuntingPopupPromise;

    // Switch to popup page and verify main menu
    bugHuntingPage.page = bugHuntingPopup;
    await bugHuntingPage.page.waitForLoadState("networkidle");
    await bugHuntingPage.verifyMainMenuVisible();

    // Navigate to Product Discovery Hunt
    await bugHuntingPage.clickProductDiscoveryHunt();
    // Wait for page to load after clicking
    await bugHuntingPage.page.waitForLoadState("networkidle");

    // Skip close bug hunting and mission verification for now
    // Navigate directly to sign in
    await bugHuntingPage.clickSignIn();

    // Update registration page to use popup
    practiceRegistration.page = bugHuntingPopup;
    await practiceRegistration.verifyLoginPageVisible();

    // Navigate to registration
    await practiceRegistration.clickRegisterLink();
    await practiceRegistration.verifyRegistrationPageVisible();

    // Fill registration form with test data
    const registrationData: RegistrationData = {
      firstName: "Bob",
      lastName: "Marley",
      dateOfBirth: "1989-12-07",
      address: "70 Summer St",
      postcode: "02110",
      city: "Boston",
      state: "MA",
      country: "America",
      email: "mm@zmtec.net",
      password: "153670153670",
      phone: "55555555",
    };

    await practiceRegistration.completeRegistration(registrationData);
  });
});
