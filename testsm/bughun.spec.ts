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

    // Navigate to sign in on the main site (not in popup)
    await practiceHomepage.page.goto(
      "https://practicesoftwaretesting.com/auth/login"
    );
    await practiceRegistration.verifyLoginPageVisible();

    // Navigate to registration
    await practiceRegistration.clickRegisterLink();
    await practiceRegistration.verifyRegistrationPageVisible();

    // Wait for the registration form to be fully loaded
    await practiceRegistration.page.waitForLoadState("networkidle");

    // Fill registration form with test data
    const registrationData: RegistrationData = {
      firstName: "bb",
      lastName: "sm",
      dateOfBirth: "1989-12-07",
      address: "700 boston",
      postcode: "02111",
      city: "boston",
      state: "ma",
      country: "AM",
      email: "mm@zmtec.net",
      password: "153670153670",
      phone: "55555555",
    };

    await practiceRegistration.completeRegistration(registrationData);
  });
});
